import { Controller, Get, Param } from '@nestjs/common';
import { UserInfoEntity } from './user-info.entity';
import { UsersService } from './users.service';
import { GetUserInfoDto } from './dto/get-user-info.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {
    }

    @ApiOperation({ summary: 'Get user info' })
    @Get(':userId')
    getUserInfo(@Param() param: GetUserInfoDto): Promise<UserInfoEntity> {
        return this.usersService.getUserInfo(param.userId);
    }
}
