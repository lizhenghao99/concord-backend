import { IsNumberString } from 'class-validator';

export class PageDto {
    @IsNumberString()
    pageNo: number;

    @IsNumberString()
    pageSize: number;
}