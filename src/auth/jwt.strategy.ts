import {
    CACHE_MANAGER,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { UserEntity } from '../users/user.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
        const { username } = payload;
        const user = await this.usersRepository.findOne({ username });
        const isLoggedIn = await this.cacheManager.get(`LOGIN:${username}`);
        if (!user || isLoggedIn !== '1') {
            throw new UnauthorizedException();
        }
        return user;
    }
}
