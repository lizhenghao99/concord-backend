import { EntityRepository, Repository } from 'typeorm';
import { PollResultEntity } from './poll-result.entity';

@EntityRepository(PollResultEntity)
export class PollResultsRepository extends Repository<PollResultEntity> {
}