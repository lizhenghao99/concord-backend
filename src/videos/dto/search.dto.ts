import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class SearchDto {
    @IsOptional()
    genrelist?: string;

    @IsOptional()
    @IsNumberString()
    start_year?: number;

    @IsOptional()
    @IsString()
    type?: string;

    @IsNotEmpty()
    @IsNumberString()
    limit: number;
}
