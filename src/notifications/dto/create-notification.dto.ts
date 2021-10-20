import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNotificationDto {
    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    message: string;

    @IsOptional()
    extras?: string;
}