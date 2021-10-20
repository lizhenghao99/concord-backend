import { IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    message: string;
}