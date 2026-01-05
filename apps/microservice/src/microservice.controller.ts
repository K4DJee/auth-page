import { Controller, Get } from '@nestjs/common';
import { MicroserviceService } from './microservice.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { generateOtpASITEmail } from './dto/generate-otp-a-s-i-t-email.dto';

@Controller()
export class MicroserviceController {
  constructor(private readonly microserviceService: MicroserviceService) {}

  @MessagePattern({cmd:'generate-otp'})
  async handleGenerateOtpAndSendItToEmail(@Payload() dto:generateOtpASITEmail) {
    return await this.microserviceService.generateOtpAndSendItToEmail(dto);
  }

  @MessagePattern({cmd: 'verify-otp'})
  async verifyOtp(){

  }

  @MessagePattern({cmd: 'verify-reset-token'})
  async verifyResetToken(){
    
  }
}
