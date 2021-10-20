import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../users/user.entity';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { PageDto } from './dto/page.dto';

@ApiTags('matches')
@Controller('matches')
@UseGuards(AuthGuard(['jwt', 'cookie']))
export class MatchesController {
    constructor(private matchesService: MatchesService) {
    }

    @ApiOperation({ summary: 'List all matches' })
    @Get()
    listAll(@GetUser() user: UserEntity) {
        return this.matchesService.listAll(user);
    }

    @ApiOperation({ summary: 'List matches paged' })
    @Get('page')
    listPaged(@GetUser() user: UserEntity, @Query() query: PageDto) {
        return this.matchesService.listPaged(user, query);
    }

    @ApiOperation({ summary: 'Find match by id' })
    @Get(':id')
    findById(@GetUser() user: UserEntity, @Param() param) {
        return this.matchesService.findById(user, param.id);
    }

    @ApiOperation({ summary: 'Create a match' })
    @Post()
    create(@GetUser() user: UserEntity, @Body() body: CreateMatchDto) {
        return this.matchesService.create(user, body);
    }

    @ApiOperation({ summary: 'List participated matches paged' })
    @Get('participated/page')
    listParticipatedPaged(@GetUser() user: UserEntity, @Query() query: PageDto) {
        return this.matchesService.listParticipatedPaged(user, query);
    }
}
