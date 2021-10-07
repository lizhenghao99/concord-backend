import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { PollEntity } from '../polls/poll.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('match')
export class MatchEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userNum: number;

    @Column()
    isLocal: number;

    @Column({ nullable: true })
    localParticipants: string;

    @Column()
    isCompleted: number;

    @Column({ nullable: true })
    result: string;

    @Column('timestamp')
    createAt: string;

    @ManyToOne(() => UserEntity, (user) => user.hostedMatches, {
        eager: true,
    })
    host: UserEntity;

    @ManyToMany(() => UserEntity, (user) => user.participatedMatches, {
        eager: true,
    })
    @JoinTable()
    remoteParticipants: UserEntity[];

    @OneToOne(() => PollEntity, (poll) => poll.match)
    @Exclude()
    @ApiHideProperty()
    poll: PollEntity;
}
