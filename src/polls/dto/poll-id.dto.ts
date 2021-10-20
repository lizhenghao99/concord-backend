import { IsNotEmpty, IsUUID } from 'class-validator';

export class PollIdDto {
    @IsNotEmpty()
    @IsUUID()
    pollId: string;
}