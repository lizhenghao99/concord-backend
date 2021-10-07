import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PollResponseEntity } from './poll-response.entity';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity('poll_response_entry')
export class PollResponseEntryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => PollResponseEntity, (response) => response.entries)
    @Exclude()
    @ApiHideProperty()
    response: PollResponseEntity

    @Column()
    item: string;

    @Column()
    score: number;
}