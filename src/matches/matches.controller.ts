import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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

    @ApiOperation({ summary: 'list all matches' })
    @Get()
    listAll(@GetUser() user: UserEntity) {
        return this.matchesService.listAll(user);
    }

    @ApiOperation({ summary: 'create a match' })
    @Post()
    create(@GetUser() user: UserEntity, @Body() body: CreateMatchDto) {
        return this.matchesService.create(user, body);
    }
}
