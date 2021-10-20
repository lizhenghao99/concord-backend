import { CACHE_MANAGER, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserInfoEntity } from './user-info.entity';
import { UserInfosRepository } from './user-infos.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { Cache } from 'cache-manager';
import { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';
import { NotificationsService } from '../notifications/notifications.service';
import { PageDto } from '../matches/dto/page.dto';
import { FriendPageDto } from './dto/friend-page.dto';
import { UserSearchResultDto } from './dto/user-search-result.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserInfosRepository)
        private userInfosRepository: UserInfosRepository,
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
        private notificationsService: NotificationsService,
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

    async getFriends(user: UserEntity): Promise<UserEntity[]> {
        const data = await this.usersRepository.findByIdWithFriends(user.id);
        data.friends.sort((a, b) => a.userInfo.nickname < b.userInfo.nickname ? -1 : 1);
        return data.friends;
    }

    async getFriendsPaged(user: UserEntity, pageDto: PageDto): Promise<FriendPageDto> {
        const data = await this.usersRepository.findByIdWithFriends(user.id);
        data.friends.sort((a, b) => a.userInfo.nickname < b.userInfo.nickname ? -1 : 1);
        const { pageNo, pageSize } = pageDto;
        const offset = (pageNo - 1) * pageSize;
        const result = new FriendPageDto();
        result.total = data.friends.length;
        result.friends = data.friends.slice(offset, offset + pageSize);
        return result;
    }

    async requestFriend(user: UserEntity, friendId: string) {
        const friend = await this.usersRepository.findByIdWithFriends(friendId);
        if (!friend) throw new NotFoundException('User not found');
        if (friend.friends.some(value => value.id === user.id)) {
            throw new ConflictException('User is already added as friend');
        }
        const received = await this.notificationsService.getReceived(friend);
        if (received.some(e => e.type === 'friend-request' && e.sender.id === user.id && e.state !== 2)) {
            throw new ConflictException('Friend request already sent');
        }
        await this.notificationsService.send(user, friend, {
            type: 'friend-request',
            title: 'New Friend Request',
            message: `${user.userInfo.nickname} (${user.username}) sent you a friend request.`,
        });
    }

    async acceptFriend(user: UserEntity, notificationId: string) {
        const notification = await this.notificationsService.getById(notificationId);
        if (notification.receiver.id !== user.id) throw new ConflictException('You are not receiver');
        await this.addFriend(user, notification.sender.id);
        await this.notificationsService.send(user, notification.sender, {
            type: 'friend-accept',
            title: 'Friend Request Accepted',
            message: `${user.userInfo.nickname} (${user.username}) accepted your friend request.`,
        });
    }

    async addFriend(user: UserEntity, friendId: string) {
        const currUser = await this.usersRepository.findByIdWithFriends(user.id);
        const friend = await this.usersRepository.findByIdWithFriends(friendId);
        if (!friend) throw new NotFoundException('User not found');
        if (friend.friends.some(value => value.id === user.id)) {
            throw new ConflictException('User is already added as friend');
        }
        currUser.friends.push(friend);
        friend.friends.push(currUser);
        await this.usersRepository.save(currUser);
        await this.usersRepository.save(friend);
    }

    async deleteFriend(user: UserEntity, friendId: string) {
        const currUser = await this.usersRepository.findByIdWithFriends(user.id);
        const friend = await this.usersRepository.findByIdWithFriends(friendId);
        if (!friend) throw new NotFoundException('User not found');
        currUser.friends = currUser.friends.filter(value => value.id !== friendId);
        friend.friends = friend.friends.filter(value => value.id !== user.id);
        await this.usersRepository.save(currUser);
        await this.usersRepository.save(friend);
    }

    async searchByUsername(user: UserEntity, username: string): Promise<UserSearchResultDto[]> {
        const friends = await this.getFriends(user);
        const users = await this.usersRepository.searchByUsername(username);
        return users.map((value) => {
            const result = new UserSearchResultDto();
            result.user = value;
            result.isFriend = friends.some(e => e.id === value.id) ? 1 : 0;
            return result;
        });
    }
}

