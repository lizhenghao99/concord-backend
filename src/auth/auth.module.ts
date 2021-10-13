import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { CookieStrategy } from './cookie.strategy';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: 3600,
                    },
                };
            },
        }),
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    store: redisStore,
                    url: configService.get('REDIS_URL'),
                };
            },
        }),
    ],
    providers: [AuthService, JwtStrategy, CookieStrategy],
    controllers: [AuthController],
    exports: [PassportModule, JwtStrategy, CookieStrategy],
})
export class AuthModule {
}
