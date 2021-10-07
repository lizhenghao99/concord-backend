import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePollDto {
    @IsNotEmpty()
    @IsUUID()
    matchId: string;

    @IsNotEmpty()
    @IsString()
    items: string;
}
