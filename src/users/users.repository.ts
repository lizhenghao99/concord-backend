import { EntityRepository, Like, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserInfoEntity } from './user-info.entity';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
    private logger = new Logger('UsersRepository', { timestamp: true });

    async createUser(username: string, password: string): Promise<UserEntity> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const userInfo = new UserInfoEntity();
        userInfo.nickname = username;
        const user = this.create({
            username,
            password: hashedPassword,
            userInfo,
        });
        try {
            await this.save(user);
        } catch (error) {
            if (error.code === '23505') {
                this.logger.error('Username already exists');
                throw new ConflictException('Username already exists');
            } else {
                this.logger.error('Database error');
                this.logger.error(error.message);
                throw new InternalServerErrorException();
            }
        }
        return user;
    }

    findByUsernameWithPassword(username: string): Promise<UserEntity> {
        return this.createQueryBuilder('user')
            .where('user.username = :username', { username })
            .addSelect('user.password')
            .getOne();
    }

    findByIdWithFriends(id: string): Promise<UserEntity> {
        return this.findOne({
            where: { id },
            relations: ['friends'],
        });
    }

    searchByUsername(username: string): Promise<UserEntity[]> {
        return this.find({
            where: {
                username: Like(`%${username}%`),
            },
            order: {
                username: 'ASC',
            },
        });
    }
}
