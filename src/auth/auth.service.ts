import { CACHE_MANAGER, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { IsDuplicateDto } from './dto/is-duplicate.dto';
import { UserEntity } from '../users/user.entity';
import { AccessTokenDto } from './dto/access-token.dto';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService', { timestamp: true });

    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private jwtService: JwtService,
    ) {
    }

    signUp(username: string, password: string): Promise<UserEntity> {
        return this.usersRepository.createUser(username, password);
    }

    async signIn(username: string, password: string): Promise<AccessTokenDto> {
        const user = await this.usersRepository.findByUsernameWithPassword(
            username,
        );
        if (user && (await bcrypt.compare(password, user.password))) {
            this.logger.log(`User ${username} successfully signed in`);
            // cache login state
            await this.cacheManager.set(`LOGIN:${username}`, '1', { ttl: 3600 });
            // jwt
            const payload: JwtPayloadInterface = { username };
            const accessToken = this.jwtService.sign(payload);

            const result = new AccessTokenDto();
            result.accessToken = accessToken;
            return result;
        } else {
            this.logger.log(`User ${username} entered invalid credentials`);
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async signOut(user: UserEntity): Promise<void> {
        await this.cacheManager.del(`LOGIN:${user.username}`);
    }

    async checkDuplicateUsername(username: string): Promise<IsDuplicateDto> {
        const count = await this.usersRepository.count({ username: username });
        const result = new IsDuplicateDto();
        result.isDuplicate = count > 0 ? 1 : 0;
        return result;
    }
}
