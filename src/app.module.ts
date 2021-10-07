import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configSchema } from './config.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleModule } from './example/example.module';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware';
import { AuthModule } from './auth/auth.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UsersModule } from './users/users.module';
import { MatchesModule } from './matches/matches.module';
import { VideosModule } from './videos/videos.module';
import { PollsModule } from './polls/polls.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.NODE_ENV}`],
            validationSchema: configSchema,
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const isProduction = configService.get('NODE_ENV') === 'prod';

                return {
                    ssl: isProduction,
                    extra: {
                        ssl: isProduction
                            ? { rejectUnauthorized: false }
                            : null,
                    },
                    type: 'postgres',
                    autoLoadEntities: true,
                    synchronize: configService.get('NODE_ENV') === 'dev',
                    url: configService.get('DATABASE_URL'),
                    namingStrategy: new SnakeNamingStrategy(),
                };
            },
        }),
        ExampleModule,
        AuthModule,
        UsersModule,
        MatchesModule,
        VideosModule,
        PollsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    }
}
