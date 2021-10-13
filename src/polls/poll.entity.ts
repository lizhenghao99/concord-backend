import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MatchEntity } from '../matches/match.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { PollResponseEntity } from './poll-response.entity';
import { PollResultEntity } from './poll-result.entity';

@Entity('poll')
export class PollEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;

    @Column({ nullable: true })
    items: string;

    @Column({ nullable: true })
    extras?: string;

    @OneToOne(() => MatchEntity, (match) => match.poll)
    @JoinColumn()
    @Exclude()
    @ApiHideProperty()
    match: MatchEntity;

    @OneToMany(() => PollResponseEntity, (response) => response.poll, {
        eager: true,
    })
    responses: PollResponseEntity[];

    @OneToOne(() => PollResultEntity, (result) => result.poll, {
        eager: true, cascade: true,
    })
    result: PollResultEntity;
}
