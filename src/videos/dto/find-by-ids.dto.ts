import { IsNotEmpty } from 'class-validator';

export class FindByIdsDto {
    @IsNotEmpty()
    ids: string;
}