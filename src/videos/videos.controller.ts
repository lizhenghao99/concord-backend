import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchDto } from './dto/search.dto';
import { VideosService } from './videos.service';
import { VideoDto } from './dto/video.dto';
import { FindByIdsDto } from './dto/find-by-ids.dto';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
    constructor(private videosService: VideosService) {
    }

    @ApiOperation({ summary: 'Search videos' })
    @Get()
    search(@Query() query: SearchDto): Promise<VideoDto[]> {
        return this.videosService.search(query);
    }

    @ApiOperation({ summary: 'Find videos by ids' })
    @Get(':ids')
    findByIds(@Param() param: FindByIdsDto): Promise<VideoDto[]> {
        return this.videosService.findByIds(param.ids);
    }
}
