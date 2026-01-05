import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { EmailService } from './email/email.service';
import { generateOtpASITEmail } from './dto/generate-otp-a-s-i-t-email.dto';

@Injectable()
export class MicroserviceService {
  constructor(
    private readonly redisService: RedisService,
    private readonly emailService: EmailService
  ){}


 async generateOtpAndSendItToEmail(dto: generateOtpASITEmail){
  try{
  const isExists = await this.redisService.exists(dto.identifier);
  if(isExists){
    throw new ConflictException("Код уже был выслан вам на почту. Дождитесь окончания срока действия кода.");
  }

  const otp = this.redisService.generateOtp();
  this.redisService.saveOtp(dto.identifier, otp);
  console.log(`generateOtpASITEmail log - ${dto}`);
  const isSent = await this.emailService.sendMessageToEmail({
    to:dto.to, message: `${otp} - ${dto.message}`,
    username: dto.username, subject: dto.subject
  })
  if(!isSent){
    throw new InternalServerErrorException("Произошла ошибка отправки кода на почту");
  }
  return {
    message: "Одноразовый код был успешно отправлен на почту"
  }
 }
 catch(error){
  console.error('💥 Critical error in generateOtpAndSendItToEmail:', {
    message: error.message,
  });
  return {
    message: "Ошибка отправки одноразового кода на почту"
  }
 }
}

  async verifyOtpAndGenResetToken(){
    // const isValid
  }
}
