// noinspection JSIgnoredPromiseFromCall

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.use(cookieParser());

    const swaggerConfig = new DocumentBuilder()
        .setTitle(process.env.npm_package_name)
        .setDescription(`The ${process.env.npm_package_name} API description`)
        .setVersion(process.env.npm_package_version)
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT;
    await app.listen(port);
    const logger = new Logger('Main', { timestamp: true });
    logger.log(`Application listening on port ${port}...`);
}

bootstrap();
