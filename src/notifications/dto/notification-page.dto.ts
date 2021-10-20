import { NotificationEntity } from '../notification.entity';

export class NotificationPageDto {
    total: number;
    notifications: NotificationEntity[];
}