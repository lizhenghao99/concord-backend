import { EntityRepository, Repository } from 'typeorm';
import { NotificationEntity } from './notification.entity';

@EntityRepository(NotificationEntity)
export class NotificationsRepository extends Repository<NotificationEntity> {

    listByReceiver(userId: string): Promise<NotificationEntity[]> {
        return this.find({
            where: { receiver: { id: userId } },
            order: { createAt: 'DESC' },
            relations: ['receiver'],
        });
    }

    countByReceiver(userId: string): Promise<number> {
        return this.count({
            where: { receiver: { id: userId } },
            order: { createAt: 'DESC' },
            relations: ['receiver'],
        });
    }

    listByReceiverPaged(userId: string, skip: number, take: number): Promise<NotificationEntity[]> {
        return this.find({
            where: { receiver: { id: userId } },
            order: { createAt: 'DESC' },
            relations: ['receiver'],
            skip,
            take,
        });
    }

    findByIdAndReceiver(id: string, receiverId: string): Promise<NotificationEntity> {
        return this.findOne({
            where: {
                id,
                receiver: { id: receiverId },
            },
            relations: ['receiver'],
        });
    }

    countNew(userId: string): Promise<number> {
        return this.count({
            where: {
                state: 0,
                receiver: { id: userId }
            },
            relations: ['receiver'],
        });
    }
}