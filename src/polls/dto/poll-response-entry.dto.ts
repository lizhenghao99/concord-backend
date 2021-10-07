import { IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class PollResponseEntryDto {
    @IsNotEmpty()
    @IsString()
    item: string;

    @IsNotEmpty()
    @Min(0)
    @Max(3)
    score: number;
}