// noinspection JSIgnoredPromiseFromCall

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT;
  await app.listen(port);
  const logger = new Logger();
  logger.log(`Application listening on port ${port}...`);
}

bootstrap();
