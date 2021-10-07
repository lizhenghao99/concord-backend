import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('user_info')
export class UserInfoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nickname: string;

    @OneToOne(() => UserEntity, (user) => user.userInfo)
    @JoinColumn()
    @Exclude()
    @ApiHideProperty()
    user: UserEntity;
}
