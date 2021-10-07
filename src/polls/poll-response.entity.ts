import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { PollResponseEntryEntity } from './poll-response-entry.entity';
import { PollEntity } from './poll.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('poll_response')
export class PollResponseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    localName: string;

    @ManyToOne(() => UserEntity, (user) => user.responses, {
        eager: true,
    })
    user: UserEntity;

    @OneToMany(() => PollResponseEntryEntity, (entry) => entry.response, {
        cascade: true,
    })
    entries: PollResponseEntryEntity[];

    @ManyToOne(() => PollEntity, (poll) => poll.responses)
    @Exclude()
    @ApiHideProperty()
    poll: PollEntity;
}