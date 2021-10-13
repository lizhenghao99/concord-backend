import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateItemsDto {
    @IsNotEmpty()
    @IsUUID()
    matchId: string;

    @IsNotEmpty()
    @IsString()
    items: string;
}