import { CacheModule, Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    store: redisStore,
                    url: configService.get('REDIS_URL'),
                };
            },
        })],
    providers: [VideosService],
    controllers: [VideosController],
    exports: [VideosService],
})
export class VideosModule {
}
