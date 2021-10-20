import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesRepository } from './matches.repository';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([MatchesRepository])],
    controllers: [MatchesController],
    providers: [MatchesService],
    exports: [TypeOrmModule],
})
export class MatchesModule {
}
