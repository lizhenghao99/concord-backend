import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserInfoEntity } from './user-info.entity';
import { UserInfosRepository } from './user-infos.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { Cache } from 'cache-manager';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserInfosRepository)
        private userInfosRepository: UserInfosRepository,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {
    }

    async getUserInfo(userId: string): Promise<UserInfoEntity> {
        const userInfo = await this.userInfosRepository.findByUserId(userId);
        if (!userInfo) throw new NotFoundException('User info not found');
        return userInfo;
    }

    async updateUserInfo(user: UserEntity, updateUserInfoDto: UpdateUserInfoDto): Promise<UserInfoEntity> {
        const userInfo = await this.userInfosRepository.findByUserId(user.id);
        for (const key in updateUserInfoDto) {
            if (key) {
                userInfo[key] = updateUserInfoDto[key];
            }
        }
        await this.userInfosRepository.save(userInfo);
        await this.cacheManager.del(`USER:${user.username}`);
        return userInfo;
    }
}
