import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../users/user.entity';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';

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
}
