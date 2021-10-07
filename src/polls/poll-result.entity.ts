import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PollEntity } from './poll.entity';

@Entity('poll_result')
export class PollResultEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    items: string;

    @Column()
    details: string;

    @OneToOne(() => PollEntity, (poll) => poll.result)
    @JoinColumn()
    poll: PollEntity;
}