import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserInfoEntity } from './user-info.entity';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './user.entity';
import { GetUser } from '../auth/get-user.decorator';

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
}
