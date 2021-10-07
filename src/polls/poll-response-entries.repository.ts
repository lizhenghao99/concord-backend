import { EntityRepository, Repository } from 'typeorm';
import { PollResponseEntryEntity } from './poll-response-entry.entity';

@EntityRepository(PollResponseEntryEntity)
export class PollResponseEntriesRepository extends Repository<PollResponseEntryEntity> {
}