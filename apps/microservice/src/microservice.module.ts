import { Module } from '@nestjs/common';
import { MicroserviceController } from './microservice.controller';
import { MicroserviceService } from './microservice.service';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          secure: configService.get<boolean>('EMAIL_SECURE'),
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false, // для разработки, в проде лучше true
          },
        },
        
        defaults: {
          from: `"No Reply" <${configService.get<string>('EMAIL_FROM')}>`,
        },
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      envFilePath: [
        path.resolve(__dirname, '..', '..', '..', '.env'),
      ],
      isGlobal: true,
    }),
    RedisModule,
    EmailModule
    ],
  controllers: [MicroserviceController],
  providers: [MicroserviceService],
})
export class MicroserviceModule {}
