import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PollsService } from './polls.service';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../users/user.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { PollEntity } from './poll.entity';
import { AuthGuard } from '@nestjs/passport';
import { MatchIdDto } from './dto/match-id.dto';
import { RespondPollDto } from './dto/respond-poll.dto';
import { UpdateItemsDto } from './dto/update-items.dto';

@ApiTags('polls')
@Controller('polls')
@UseGuards(AuthGuard(['jwt', 'cookie']))
export class PollsController {
    constructor(private pollsService: PollsService) {
    }

    @ApiOperation({ summary: 'Create new poll' })
    @Post()
    create(@GetUser() user: UserEntity, @Body() body: CreatePollDto): Promise<PollEntity> {
        return this.pollsService.create(user, body);
    }

    @ApiOperation({ summary: 'Find by match id' })
    @Get(':matchId')
    findByMatchId(@GetUser() user: UserEntity, @Param() param: MatchIdDto): Promise<PollEntity> {
        return this.pollsService.findByMatchId(user, param.matchId);
    }

    @ApiOperation({ summary: 'Update poll items' })
    @Patch()
    updatePollItems(@GetUser() user: UserEntity, @Body() body: UpdateItemsDto): Promise<PollEntity> {
        return this.pollsService.updateItems(user, body);
    }

    @ApiOperation({ summary: 'Respond to poll' })
    @Post('respond')
    respond(@GetUser() user: UserEntity, @Body() body: RespondPollDto): Promise<void> {
        return this.pollsService.respond(user, body);
    }

    @ApiOperation({ summary: 'Opt out of poll' })
    @Post('opt-out')
    optOut(@GetUser() user: UserEntity, @Body() body: MatchIdDto): Promise<void> {
        return this.pollsService.optOut(user, body.matchId);
    }

    @ApiOperation({ summary: 'Generate result' })
    @Post('result/:pollId')
    generateResult(@Param() param) {
        return this.pollsService.generateResult(param.pollId);
    }
}
