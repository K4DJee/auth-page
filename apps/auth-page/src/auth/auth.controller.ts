import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { equal } from 'assert';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() dto:registerDto){
    return await this.authService.register(dto);
  }

  @Post('/login')
  async login(@Body() dto:LoginDto){
    return await this.authService.login(dto);
  }

  @UseGuards(AuthGuard())
  @Get('/user-data')
  async userData(@Req() req: Request){
    const user = req.user;
    return {
      message: "Данные пользователя",
      user: user
    };
  }
  
  @Post('/reset-password-stage-0')
  async resetPassword(@Req() req: Request){
    const user = req.user!;
    const dto = {
      identifier: user['id'], to: user['email'],
      message: "password reset code",
      username: user['firstName'],
      subject: "Reset password"
    }
    return await this.authService.generateOtp(dto);
  }

  @UseGuards(AuthGuard())
  @Post('/reset-password-stage-1')
  async resetPasswordStage1(@Req() req: Request){
    const user = req.user!;
    const dto = {
      identifier: user['id'], to: user['email'],
      message: "password reset code",
      username: user['firstName'],
      subject: "Reset password"
    }
    return await this.authService.generateOtp(dto);
  }

  @Post('/reset-password-stage-2')
  async resetPasswordStage2(){
    // return await this.authService.verifyOtpAndResetPassword();
  }

  @Post('/reset-password-stage-3')
  async resetPasswordStage3(){

  }

    
}
