import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity('notification')
export class NotificationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, (user) => user.notificationsSent, {
        eager: true,
    })
    sender: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.notificationsReceived, {
        eager: true,
    })
    receiver: UserEntity;

    @Column()
    type: string;

    @Column()
    title: string;

    @Column()
    message: string;

    @Column()
    state: number;

    @Column('timestamp')
    createAt: string;

    @Column({ nullable: true })
    extras: string;
}