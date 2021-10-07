import { IsNotEmpty } from 'class-validator';

export class CreateExampleDto {
    @IsNotEmpty()
    name: string;
}
