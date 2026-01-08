import { Controller, Get } from '@nestjs/common';
import { MicroserviceService } from './microservice.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { generateOtpASITEmail } from './dto/generate-otp-a-s-i-t-email.dto';
import { VerifyOtpResetToken } from './dto/verify-otp-reset-token.dto';
import { VerifyResetToken } from './dto/verify-reset-token.dto';

@Controller()
export class MicroserviceController {
  constructor(private readonly microserviceService: MicroserviceService) {}

  @MessagePattern({cmd:'generate-otp'})
  async handleGenerateOtpAndSendItToEmail(@Payload() dto:generateOtpASITEmail) {
    return await this.microserviceService.generateOtpAndSendItToEmail(dto);
  }

  @MessagePattern({cmd: 'verify-otp'})
  async verifyOtp(@Payload() dto:VerifyOtpResetToken){
    return await this.microserviceService.verifyOtpAndGenResetToken(dto);
  }

  @MessagePattern({cmd: 'verify-reset-token'})
  async verifyResetToken(@Payload() dto: VerifyResetToken){
      return await this.microserviceService.verifyResetToken(dto);
  }
}
