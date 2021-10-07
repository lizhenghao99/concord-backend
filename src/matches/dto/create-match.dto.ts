import { IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateMatchDto {
    @IsNotEmpty()
    @Max(1)
    @Min(0)
    isLocal: number;

    @IsNotEmpty()
    @Min(2)
    userNum: number;

    @IsOptional()
    @IsString()
    localParticipants?: string;
}
