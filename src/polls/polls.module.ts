import { Module } from '@nestjs/common';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollsRepository } from './polls.repository';
import { MatchesModule } from '../matches/matches.module';
import { PollResponsesRepository } from './poll-responses.repository';
import { PollResponseEntriesRepository } from './poll-response-entries.repository';
import { PollResultsRepository } from './poll-results.repository';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        AuthModule,
        MatchesModule,
        NotificationsModule,
        TypeOrmModule.forFeature([
            PollsRepository,
            PollResponsesRepository,
            PollResponseEntriesRepository,
            PollResultsRepository]),
    ],
    controllers: [PollsController],
    providers: [PollsService],
    exports: [TypeOrmModule, PollsService],
})
export class PollsModule {
}
