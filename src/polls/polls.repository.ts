import { EntityRepository, Repository } from 'typeorm';
import { PollEntity } from './poll.entity';

@EntityRepository(PollEntity)
export class PollsRepository extends Repository<PollEntity> {
    findById(id: string) {
        return this.findOne({ id });
    }

    findByMatchId(matchId: string, userId: string): Promise<PollEntity> {
        return this.findOne({
            where: { match: { id: matchId, host: { id: userId } } },
            relations: ['match'],
        });
    }

    findByIdWithMatchAndResponseEntries(id: string) {
        return this.findOne({
            where: { id },
            relations: ['match', 'responses', 'responses.entries'],
        });
    }

    listByHostUserId(userId: string): Promise<PollEntity[]> {
        return this.find({
            where: { match: { host: { id: userId } } },
            relations: ['match'],
        });
    }
}
