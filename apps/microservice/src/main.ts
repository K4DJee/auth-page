import { NestFactory } from '@nestjs/core';
import { MicroserviceModule } from './microservice.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MicroserviceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4000,
      },
    },
  );
  await app.listen();
  console.log('✅ Microservice listening on TCP port 4000');
}
bootstrap();
