import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { UserInfosRepository } from './user-infos.repository';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([UsersRepository, UserInfosRepository]),
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
    controllers: [UsersController],
    providers: [UsersService],
    exports: [TypeOrmModule],
})
export class UsersModule {
}
