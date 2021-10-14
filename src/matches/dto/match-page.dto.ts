import { MatchEntity } from '../match.entity';

export class MatchPageDto {
    total: number;
    matches: MatchEntity[];
}