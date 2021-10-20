import { UserEntity } from '../user.entity';

export class FriendPageDto {
    total: number;
    friends: UserEntity[];
}