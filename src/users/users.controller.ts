import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserInfoEntity } from './user-info.entity';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { UserIdDto } from './dto/user-id.dto';
import { NotificationIdDto } from '../notifications/dto/notification-id.dto';
import { PageDto } from '../matches/dto/page.dto';
import { FriendPageDto } from './dto/friend-page.dto';
import { UserSearchResultDto } from './dto/user-search-result.dto';

@UseGuards(AuthGuard(['jwt', 'cookie']))
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    @ApiOperation({ summary: 'Get user info' })
    @Get()
    getUserInfo(@GetUser() user: UserEntity): Promise<UserInfoEntity> {
        return this.usersService.getUserInfo(user.id);
    }

    @ApiOperation({ summary: 'Update user info' })
    @Patch()
    updateUserInfo(@GetUser() user: UserEntity, @Body() body: UpdateUserInfoDto): Promise<UserInfoEntity> {
        return this.usersService.updateUserInfo(user, body);
    }

    @ApiOperation({ summary: 'Get friends' })
    @Get('friends')
    getFriends(@GetUser() user: UserEntity): Promise<UserEntity[]> {
        return this.usersService.getFriends(user);
    }

    @ApiOperation({ summary: 'Get friends paged' })
    @Get('friends/page')
    getFriendsPaged(@GetUser() user: UserEntity, @Query() query: PageDto): Promise<FriendPageDto> {
        return this.usersService.getFriendsPaged(user, query);
    }

    @ApiOperation({ summary: 'Request friend' })
    @Post('friends/request')
    addFriend(@GetUser() user: UserEntity, @Body() body: UserIdDto): Promise<void> {
        return this.usersService.requestFriend(user, body.userId);
    }

    @ApiOperation({ summary: 'Accept friend' })
    @Post('friends/accept')
    acceptFriend(@GetUser() user: UserEntity, @Body() body: NotificationIdDto): Promise<void> {
        return this.usersService.acceptFriend(user, body.notificationId);
    }

    @ApiOperation({ summary: 'Delete friend' })
    @Delete('friends/:id')
    deleteFriend(@GetUser() user: UserEntity, @Param() param): Promise<void> {
        return this.usersService.deleteFriend(user, param.id);
    }

    @ApiOperation({ summary: 'Search user by username' })
    @Get('search/:username')
    searchByUsername(@GetUser() user: UserEntity, @Param() param): Promise<UserSearchResultDto[]> {
        return this.usersService.searchByUsername(user, param.username);
    }
}
