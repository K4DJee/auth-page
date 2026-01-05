import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { jwtConstants } from "../constants";
import { DatabaseService } from "../../database/database.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly dbService: DatabaseService,
        private readonly jwtService: JwtService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest() as Request;
        const authHeader =  request.headers['authorization'];

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException("Вы должны быть авторизованы");
        }

        const token = authHeader.substring(7);//Убираем Bearer 
        //Верификация access token
        try{
          
        
      const veryfyPayload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
        ignoreExpiration: false
      });

      const user = await this.dbService.user.findUnique({
        where:{id: veryfyPayload.sub},
        select:{
          id: true,
          firstName: true,
          lastName: true,
          email:true,
          role: true,
          createdAt: true
        }
      });

      if(!user){
        throw new UnauthorizedException("Пользователь не найден");
      }

        request['user'] = user;
        return true;
    }
    catch(error){
      if(error.name === 'JsonWebTokenError'){
        throw new UnauthorizedException("Невалидный токен");
      }
      else if(error.name === "TokenExpiredError"){
        throw new UnauthorizedException("Срок действия токена истёк");
      }
      else if(error instanceof UnauthorizedException){
        throw error;
      }

      throw new UnauthorizedException("Ошибка авторизации");
    }
    }
}