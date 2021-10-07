import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PollsService } from './polls.service';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../users/user.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollEntity } from './poll.entity';
import { AuthGuard } from '@nestjs/passport';
import { MatchIdDto } from './dto/match-id.dto';
import { RespondPollDto } from './dto/respond-poll.dto';

@ApiTags('polls')
@Controller('polls')
@UseGuards(AuthGuard(['jwt', 'cookie']))
export class PollsController {
    constructor(private pollsService: PollsService) {
    }

    @ApiOperation({ summary: 'create new poll' })
    @Post()
    create(@GetUser() user: UserEntity, @Body() body: CreatePollDto): Promise<PollEntity> {
        return this.pollsService.create(user, body);
    }

    @ApiOperation({ summary: 'find by match id' })
    @Get(':matchId')
    findByMatchId(@GetUser() user: UserEntity, @Param() param: MatchIdDto): Promise<PollEntity> {
        return this.pollsService.findByMatchId(user, param.matchId);
    }

    @ApiOperation({ summary: 'respond to poll' })
    @Post('respond')
    respond(@GetUser() user: UserEntity, @Body() body: RespondPollDto): Promise<void> {
        return this.pollsService.respond(user, body);
    }

    @ApiOperation({ summary: 'generate result' })
    @Post('result/:pollId')
    generateResult(@Param() param) {
        return this.pollsService.generateResult(param.pollId);
    }
}