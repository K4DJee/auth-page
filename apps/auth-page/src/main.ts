import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import { AllExceptionsFiler } from './filters/all-exceptions.filer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform:true,
      whitelist: true,
      transformOptions:{
        enableImplicitConversion:true,
      }
    })
  )

  const config = new DocumentBuilder()
  .setTitle("Auth-page project")
  .setDescription("API documentation Auth-page")
  .setVersion("1.0.0")
  .setContact("K4DJE Studio ", "https://t.me/k4dje_studio", "k4djexfullstack@gmail.com")
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Enter JWT token',
      in: 'header',
    },
    'access-token')
  .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, document, {
    jsonDocumentUrl: "/swagger.json"//Вся swagger документация в json формате
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
