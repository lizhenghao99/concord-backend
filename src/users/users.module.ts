import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { UserInfosRepository } from './user-infos.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UsersRepository, UserInfosRepository])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [TypeOrmModule],
})
export class UsersModule {
}
