import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { UserInfoEntity } from './user-info.entity';
import { MatchEntity } from '../matches/match.entity';
import { PollResponseEntity } from '../polls/poll-response.entity';
import { NotificationEntity } from '../notifications/notification.entity';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ select: false })
    @Exclude()
    @ApiHideProperty()
    password: string;

    @OneToOne(() => UserInfoEntity, (userInfo) => userInfo.user, {
        cascade: ['insert'],
        eager: true,
    })
    userInfo: UserInfoEntity;

    @OneToMany(() => MatchEntity, (match) => match.host)
    @Exclude()
    @ApiHideProperty()
    hostedMatches: MatchEntity[];

    @ManyToMany(() => MatchEntity, (match) => match.remoteParticipants)
    @Exclude()
    @ApiHideProperty()
    participatedMatches: MatchEntity[];

    @OneToMany(() => PollResponseEntity, (response) => response.user)
    @Exclude()
    @ApiHideProperty()
    responses: PollResponseEntity[];

    @ManyToMany(() => UserEntity)
    @JoinTable()
    friends: UserEntity[];

    @OneToMany(() => NotificationEntity, (notification) => notification.sender)
    @Exclude()
    @ApiHideProperty()
    notificationsSent: NotificationEntity[];

    @OneToMany(() => NotificationEntity, (notification) => notification.receiver)
    @Exclude()
    @ApiHideProperty()
    notificationsReceived: NotificationEntity[];
}
