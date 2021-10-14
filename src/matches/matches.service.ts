import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchesRepository } from './matches.repository';
import { UserEntity } from '../users/user.entity';
import { MatchEntity } from './match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { PageDto } from './dto/page.dto';
import { MatchPageDto } from './dto/match-page.dto';

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(MatchesRepository)
        private matchesRepository: MatchesRepository,
    ) {
    }

    listAll(user: UserEntity): Promise<MatchEntity[]> {
        return this.matchesRepository.listByUserId(user.id);
    }

    async listPaged(user: UserEntity, pageDto: PageDto): Promise<MatchPageDto> {
        const skip = (pageDto.pageNo - 1) * pageDto.pageSize;
        const result = new MatchPageDto();
        result.matches = await this.matchesRepository.listByUserIdPaged(user.id, skip, pageDto.pageSize);
        result.total = await this.matchesRepository.countByUserId(user.id);
        return result;
    }

    findById(user: UserEntity, matchId: string): Promise<MatchEntity> {
        return this.matchesRepository.findByIdAndUserId(matchId, user.id);
    }

    async create(
        user: UserEntity,
        createMatchDto: CreateMatchDto,
    ): Promise<MatchEntity> {
        const match = this.matchesRepository.create({
            ...createMatchDto,
            createAt: new Date(Date.now()).toISOString(),
            host: user,
            isCompleted: 0,
        });
        if (match.isLocal === 1) {
            if (!match.localParticipants ||
                match.localParticipants.split(',').length !== match.userNum - 1) {
                throw new BadRequestException('Local match must contain correct participants names');
            }
        }
        await this.matchesRepository.save(match);
        return match;
    }
}
