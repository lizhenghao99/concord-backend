import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PollResponseEntryDto } from './poll-response-entry.dto';

export class RespondPollDto {
    @IsNotEmpty()
    @IsUUID()
    pollId: string;

    @IsOptional()
    @IsString()
    localName?: string = '';

    @IsNotEmpty()
    @IsArray()
    entries: PollResponseEntryDto[];
}