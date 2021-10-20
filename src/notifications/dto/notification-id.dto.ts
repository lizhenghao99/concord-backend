import { IsNotEmpty, IsUUID } from 'class-validator';

export class NotificationIdDto {
    @IsNotEmpty()
    @IsUUID()
    notificationId: string;
}