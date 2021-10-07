import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PollsRepository } from './polls.repository';
import { MatchesRepository } from '../matches/matches.repository';
import { UserEntity } from '../users/user.entity';
import { PollEntity } from './poll.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { RespondPollDto } from './dto/respond-poll.dto';
import { PollResponsesRepository } from './poll-responses.repository';
import { PollResponseEntriesRepository } from './poll-response-entries.repository';
import { PollResultsRepository } from './poll-results.repository';

@Injectable()
export class PollsService {
    private logger = new Logger('PollsService', { timestamp: true });

    constructor(
        @InjectRepository(PollsRepository)
        private pollsRepository: PollsRepository,
        @InjectRepository(MatchesRepository)
        private matchesRepository: MatchesRepository,
        @InjectRepository(PollResponsesRepository)
        private pollResponsesRepository: PollResponsesRepository,
        @InjectRepository(PollResponseEntriesRepository)
        private pollResponseEntriesRepository: PollResponseEntriesRepository,
        @InjectRepository(PollResultsRepository)
        private pollResultsRepository: PollResultsRepository,
    ) {
    }

    async create(user: UserEntity, createPollDto: CreatePollDto): Promise<PollEntity> {
        const match = await this.matchesRepository.findByIdAndUserId(
            createPollDto.matchId,
            user.id,
        );
        if (!match) throw new NotFoundException('Match not found');
        this.logger.log(JSON.stringify(match.poll));
        if (match.poll) throw new ConflictException('Match already has a poll');
        const poll = await this.pollsRepository.create({
            match,
            items: createPollDto.items,
        });
        await this.pollsRepository.save(poll);
        return poll;
    }

    async findByMatchId(user: UserEntity, matchId: string): Promise<PollEntity> {
        const poll = await this.pollsRepository.findByMatchId(matchId, user.id);
        if (!poll) throw new NotFoundException('Poll not found');
        return poll;
    }

    async respond(user: UserEntity, respondPollDto: RespondPollDto): Promise<void> {
        const poll = await this.pollsRepository.findById(respondPollDto.pollId);
        if (!poll) throw new NotFoundException('Poll not found');
        const prevResponse = await this.pollResponsesRepository.findByUserIdAndLocalName(user.id, respondPollDto.localName);
        if (prevResponse) throw new ConflictException('User with local name already responded to poll');
        const response = this.pollResponsesRepository.create({
            user,
            poll,
            localName: respondPollDto.localName,
            entries: respondPollDto.entries.map((entryDto) => (
                this.pollResponseEntriesRepository.create({ ...entryDto })
            )),
        });
        await this.pollResponsesRepository.save(response);
        await this.generateResult(respondPollDto.pollId);
    }

    async generateResult(pollId: string) {
        const poll = await this.pollsRepository.findByIdWithMatchAndResponseEntries(pollId);
        if (poll.responses.length !== poll.match.userNum) return;
        if (poll.result) throw new ConflictException('Poll already has result');
        const entries = poll.responses.flatMap((response) => response.entries);
        const itemsSum = entries.reduce((prev, curr) => {
            const { item, score } = curr;
            if (prev.some((e) => e.item === item)) {
                prev.find((e) => e.item === item).score += score;
            } else {
                prev.push({ item, score });
            }
            return prev;
        }, []);
        const details = itemsSum.sort((a, b) => a.score < b.score ? 1 : -1);
        this.logger.log(`Poll result details: ${JSON.stringify(details)}`);
        const items = itemsSum.slice(0, 3).map((e) => e.item).join(',');
        poll.result = this.pollResultsRepository.create({
            items,
            details: JSON.stringify(details),
        });
        await this.pollsRepository.save(poll);
        // update match
        const match = poll.match;
        match.isCompleted = 1;
        match.result = items;
        await this.matchesRepository.save(match);
    }
}
