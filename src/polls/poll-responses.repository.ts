import { EntityRepository, Repository } from 'typeorm';
import { PollResponseEntity } from './poll-response.entity';

@EntityRepository(PollResponseEntity)
export class PollResponsesRepository extends Repository<PollResponseEntity> {
    findByUserIdAndLocalName(pollId: string, userId: string, localName: string): Promise<PollResponseEntity> {
        return this.findOne({
            where: {
                user: { id: userId },
                localName: localName,
                poll: { id: pollId },
            },
            relations: ['poll'],
        });
    }
}