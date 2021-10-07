import { Injectable, NotFoundException } from '@nestjs/common';
import { UserInfoEntity } from './user-info.entity';
import { UserInfosRepository } from './user-infos.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserInfosRepository)
        private userInfosRepository: UserInfosRepository,
    ) {
    }

    async getUserInfo(userId: string): Promise<UserInfoEntity> {
        const userInfo = await this.userInfosRepository.findByUserId(userId);
        if (!userInfo) throw new NotFoundException('User info not found');
        return userInfo;
    }
}
