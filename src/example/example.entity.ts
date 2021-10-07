import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('example')
export class ExampleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
}
