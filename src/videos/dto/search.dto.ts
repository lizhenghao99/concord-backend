import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class SearchDto {
    @IsOptional()
    genrelist?: string;

    @IsOptional()
    @IsNumberString()
    start_year?: number;

    @IsNotEmpty()
    @IsNumberString()
    limit: number;
}
