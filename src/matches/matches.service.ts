import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchesRepository } from './matches.repository';
import { UserEntity } from '../users/user.entity';
import { MatchEntity } from './match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { PageDto } from './dto/page.dto';
import { MatchPageDto } from './dto/match-page.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(MatchesRepository)
        private matchesRepository: MatchesRepository,
        private usersService: UsersService,
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

    async findById(user: UserEntity, matchId: string): Promise<MatchEntity> {
        const match = await this.matchesRepository.findById(matchId);
        if (match.isLocal) {
            if (match.host.id !== user.id) throw new UnauthorizedException();
        } else {
            const responderList = match.remoteParticipants.map(value => value.id);
            if (match.host.id !== user.id && !responderList.includes(user.id)) {
                throw new UnauthorizedException();
            }
        }
        return match;
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
        } else {
            if (!match.remoteParticipants ||
                match.remoteParticipants.length !== match.userNum - 1) {
                throw new BadRequestException('Remote match must contain correct participants');
            }
        }
        await this.matchesRepository.save(match);
        return match;
    }

    async listParticipatedPaged(user: UserEntity, pageDto: PageDto): Promise<MatchPageDto> {
        const { pageNo, pageSize } = pageDto;
        const userData = await this.usersService.findWithParticipatedMatches(user);
        const matches = userData.participatedMatches;
        matches.sort(
            (a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
        const offset = (pageNo - 1) * pageSize;
        const result = new MatchPageDto();
        result.matches = matches.slice(offset, offset + pageSize);
        result.total = matches.length;
        return result;
    }
}
