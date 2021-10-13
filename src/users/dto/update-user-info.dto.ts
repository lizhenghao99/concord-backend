import { IsString, MaxLength } from 'class-validator';

export class UpdateUserInfoDto {
    @IsString()
    @MaxLength(16)
    nickname: string;
}