import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetUserInfoDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;
}
