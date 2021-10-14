import { EntityRepository, Repository } from 'typeorm';
import { MatchEntity } from './match.entity';

@EntityRepository(MatchEntity)
export class MatchesRepository extends Repository<MatchEntity> {
    listByUserId(userId: string): Promise<MatchEntity[]> {
        return this.find({
            where: { host: { id: userId } },
            order: { createAt: 'DESC' },
            relations: ['poll'],
        });
    }

    countByUserId(userId: string): Promise<number> {
        return this.count({
            where: { host: { id: userId } },
            order: { createAt: 'DESC' },
            relations: ['poll'],
        })
    }

    listByUserIdPaged(userId: string, skip: number, take: number): Promise<MatchEntity[]> {
        return this.find({
            where: { host: { id: userId } },
            order: { createAt: 'DESC' },
            relations: ['poll'],
            skip,
            take,
        });
    }

    findByIdAndUserId(id: string, userId: string): Promise<MatchEntity> {
        return this.findOne({
            where: { id, host: { id: userId } },
            relations: ['poll'],
        });
    }
}
