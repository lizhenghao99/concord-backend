import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePollDto {
    @IsNotEmpty()
    @IsUUID()
    matchId: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    items?: string;

    @IsOptional()
    @IsString()
    extras?: string;
}
