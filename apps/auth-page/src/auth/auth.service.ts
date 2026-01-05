import { ConflictException, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { registerDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/database.service';
import { ClientProxy } from '@nestjs/microservices';
import { generateOtpASITEmail } from './dto/generate-otp-a-s-i-t-email.dto';


@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly dbService: DatabaseService, 
    private readonly jwtService: JwtService,
    @Inject('MICROSERVICE_CLIENT') private readonly microserviceClient: ClientProxy,
  ){}

  async onModuleInit() {
    await this.microserviceClient.connect();
    console.log('✅ Connected to microservice');
  }
  
  async register(dto:registerDto){
    const existingUser = await this.dbService.user.findUnique({
        where: {email: dto.email}
    });

    if(existingUser){
        throw new ConflictException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, jwtConstants.saltRounds);

    const user = await this.dbService.user.create({
      data:{
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,

      },
      select:{
        id:true,
        email:true,
        // password:true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      firstName: user.firstName
    });

    return {
      user, 
      ...tokens
    }
  }

  async login(dto: LoginDto){
    const user = await this.dbService.user.findUnique({
      where:{email: dto.email}
    });

    if(!user){
        throw new UnauthorizedException("Неверный email или password");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)
    
    if(!isPasswordValid){
      throw new UnauthorizedException("Неверный email или password");
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      firstName: user.firstName
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens
    }
  }

  async userData(){
    
  }

  async logout(){

  }

  private async generateTokens(payload: IJwtPayload){//Генерация access и refresh токенов

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync<IJwtPayload>(payload,{
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.expiresIn
      }),
      await this.jwtService.signAsync<IJwtPayload>(payload,{
        secret: jwtConstants.refreshSecret,
        expiresIn:jwtConstants.refreshExpiresIn
      }),
    ]);

    const expiresIn = this.getTokenExpiration(jwtConstants.expiresIn);


    return { accessToken, refreshToken, expiresIn };
  }

  async refreshToken(refreshToken: string){
    try{  
      //Верификация payload
      const veryfyPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret
      });

      const user = await this.dbService.user.findUnique({
        where:{id: veryfyPayload.sub},
        select:{
          id: true,
          firstName: true,
          lastName: true,
          email:true,
          role: true
        }
      });

      if(user!){
        throw new UnauthorizedException();
      }

      return await this.generateTokens({
        sub:user!.id,
        email: user!.email,
        firstName: user!.firstName
      })
    }
    catch(error){
      throw new UnauthorizedException("Невалидный refresh-токен");
    }
  }

  async validateUser(payload: IJwtPayload){
    const user = await this.dbService.user.findUnique({
      where: {id: payload.sub},
    });

    return user;
  }

  private getTokenExpiration(expiresIn: number){

  }

  async generateOtp(dto: generateOtpASITEmail){
    try {
      const response = await this.microserviceClient
        .send({cmd:'generate-otp'}, dto)
        .toPromise();
      
      console.log('✅ Microservice response:', response);
      return response;
    } catch (error) {
      console.error('❌ Microservice error:', error);
      return error;
    }
  }
}
