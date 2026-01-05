import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {PassportModule } from '@nestjs/passport';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '../database/database.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:jwtConstants.secret,
      signOptions: {expiresIn: '60s'},//60 seconds access token
    }),
    ClientsModule.register([
      {
        name: 'MICROSERVICE_CLIENT',
        transport: Transport.TCP,
        options:{
          host:'localhost',
          port: 4000
        }
      }
    ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy, 
    AuthGuard
  ],
  exports:[
    AuthService,
    JwtStrategy,
    PassportModule,
    AuthGuard,
    JwtModule
  ]
})
export class AuthModule {}
