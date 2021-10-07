import {
    IsAlphanumeric,
    IsNotEmpty,
    MaxLength,
    MinLength,
} from 'class-validator';

export class UsernameDto {
    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(4)
    @MaxLength(20)
    username: string;
}
