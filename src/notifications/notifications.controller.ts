import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../users/user.entity';
import { NotificationEntity } from './notification.entity';
import { PageDto } from '../matches/dto/page.dto';
import { NotificationPageDto } from './dto/notification-page.dto';
import { SetStateDto } from './dto/set-state.dto';
import { NewCountDto } from './dto/new-count.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(AuthGuard(['jwt', 'cookie']))
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {
    }

    @ApiOperation({ summary: 'List notifications received' })
    @Get('received')
    listReceived(@GetUser() user: UserEntity): Promise<NotificationEntity[]> {
        return this.notificationsService.getReceived(user);
    }

    @ApiOperation({ summary: 'List notifications received Paged' })
    @Get('received/page')
    listReceivedPaged(@GetUser() user: UserEntity, @Query() query: PageDto): Promise<NotificationPageDto> {
        return this.notificationsService.getReceivedPaged(user, query);
    }

    @ApiOperation({ summary: 'Change notification state' })
    @Post('state')
    setState(@GetUser() user: UserEntity, @Body() body: SetStateDto): Promise<void> {
        return this.notificationsService.setState(user, body.notificationId, body.state);
    }

    @ApiOperation({ summary: 'Check new notifications' })
    @Get('new')
    checkNew(@GetUser() user: UserEntity): Promise<NewCountDto> {
        return this.notificationsService.checkNew(user);
    }
}
