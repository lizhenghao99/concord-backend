import { IsNotEmpty, IsUUID } from 'class-validator';

export class MatchIdDto {
    @IsNotEmpty()
    @IsUUID()
    matchId: string;
}