import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailDto } from './dto/mail.dto';


@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendMessageToEmail(dto: MailDto): Promise<boolean> {
        try {
          await this.mailerService.sendMail({
            to: dto.to,
            from: 'k4djexfullstack@gmail.com',
            subject: dto.subject,
            text: `Hello, ${dto.username}. ${dto.message}`,
            html: `Hello, ${dto.username}. ${dto.message}`,
          });
          console.log('Notification sent to email successfully');
          return true;
        } catch (err) {
          // Логируем ОБЯЗАТЕЛЬНО — даже если потом пробросим
          console.error('🚨 Email sending failed:', {
            message: err.message,
            stack: err.stack,
            code: err.code,
            command: err.command,
          });
          return false;
        }
      }
}
