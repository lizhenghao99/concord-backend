import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationsRepository } from './notifications.repository';
import { UserEntity } from '../users/user.entity';
import { NotificationEntity } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PageDto } from '../matches/dto/page.dto';
import { NotificationPageDto } from './dto/notification-page.dto';
import { NewCountDto } from './dto/new-count.dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(NotificationsRepository)
        private notificationsRepository: NotificationsRepository,
    ) {
    }

    async getById(id: string): Promise<NotificationEntity> {
        const notification = this.notificationsRepository.findOne({ id });
        if (!notification) throw new NotFoundException('Notification not found');
        return notification;
    }

    getReceived(user: UserEntity): Promise<NotificationEntity[]> {
        return this.notificationsRepository.listByReceiver(user.id);
    }

    async getReceivedPaged(user: UserEntity, pageDto: PageDto): Promise<NotificationPageDto> {
        const { pageNo, pageSize } = pageDto;
        const skip = (pageNo - 1) * pageSize;
        const result = new NotificationPageDto();
        result.total = await this.notificationsRepository.countByReceiver(user.id);
        result.notifications = await this.notificationsRepository.listByReceiverPaged(user.id, skip, pageSize);
        return result;
    }

    async send(sender: UserEntity, receiver: UserEntity, createNotificationDto: CreateNotificationDto) {
        const notification = this.notificationsRepository.create({
            ...createNotificationDto,
            state: 0,
            createAt: new Date(Date.now()).toISOString(),
        });
        notification.sender = sender;
        notification.receiver = receiver;
        await this.notificationsRepository.save(notification);
    }

    async setState(user: UserEntity, id: string, state: number) {
        const notification = await this.notificationsRepository.findByIdAndReceiver(id, user.id);
        if (!notification) throw new NotFoundException('Notification not found');
        notification.state = state;
        await this.notificationsRepository.save(notification);
    }

    async checkNew(user: UserEntity): Promise<NewCountDto> {
        const newCount = await this.notificationsRepository.countNew(user.id);
        const result = new NewCountDto();
        result.count = newCount;
        return result;
    }
}

