import { UserEntity } from '../user.entity';

export class UserSearchResultDto {
    user: UserEntity;
    isFriend: number;
}