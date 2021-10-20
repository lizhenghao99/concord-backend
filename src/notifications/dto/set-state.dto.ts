import { IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

export class SetStateDto {
    @IsNotEmpty()
    @IsUUID()
    notificationId: string;

    @IsNotEmpty()
    @Min(0)
    @Max(2)
    state: number;
}