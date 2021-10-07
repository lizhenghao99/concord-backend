import { EntityRepository, Repository } from 'typeorm';
import { UserInfoEntity } from './user-info.entity';

@EntityRepository(UserInfoEntity)
export class UserInfosRepository extends Repository<UserInfoEntity> {
    findByUserId(userId: string): Promise<UserInfoEntity> {
        return this.findOne({
            where: {
                user: { id: userId },
            },
            relations: ['user'],
        });
    }
}
