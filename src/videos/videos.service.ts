import { BadRequestException, CACHE_MANAGER, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SearchDto } from './dto/search.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { SearchDataDto } from './dto/search-data.dto';
import { getRandomInt, shuffle } from '../lib/utils';
import { VideoDto } from './dto/video.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class VideosService {
    private logger = new Logger('VideosService', { timestamp: true });

    constructor(
        private configService: ConfigService,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache) {
    }

    async search(searchDto: SearchDto): Promise<VideoDto[]> {
        this.logger.verbose(`Searching videos for ${JSON.stringify(searchDto)}`);
        let response;
        try {
            response = await this.searchAPI(searchDto, 0);
        } catch (error) {
            this.logger.error(error.message);
            throw new BadRequestException('Netflix API error');
        }
        let data = response.data as SearchDataDto;
        this.logger.verbose(`Search result total: ${data.total}`);
        const offset = getRandomInt(Math.floor(data.total / 100)) * 100;
        this.logger.verbose(`Offset is: ${offset}`);
        if (offset > 0) {
            try {
                response = await this.searchAPI(searchDto, offset);
            } catch (error) {
                this.logger.error(error.message);
                throw new BadRequestException('Netflix API error');
            }
            data = response.data as SearchDataDto;
        }
        let results: VideoDto[] = data.results.map(
            ({ nfid, title, img, vtype, synopsis, year, imdbrating }) =>
                ({ id: nfid, title, img, vtype, synopsis, year, imdbrating } as VideoDto),
        );
        shuffle(results);
        results = results.slice(0, searchDto.limit);
        for (const video of results) {
            await this.cacheManager.set(`VIDEO:${video.id}`, JSON.stringify(video), { ttl: 3600 });
        }
        return results;
    }

    async findByIds(ids: string): Promise<VideoDto[]> {
        const idList = ids.split(',');
        return await Promise.all(idList.map(async netflixId => {
            const videoCache: string = await this.cacheManager.get(`VIDEO:${netflixId}`);
            if (videoCache) return JSON.parse(videoCache) as VideoDto;
            let response;
            try {
                response = await this.titleAPI(netflixId);
            } catch (error) {
                this.logger.error(error.message);
                throw new BadRequestException('Netflix API error');
            }
            if (!response.data.results || response.data.results.length === 0) {
                throw new NotFoundException(`Video with id ${netflixId} not found`);
            }
            const { nfid, title, img, vtype, synopsis, year, imdbrating } = response.data.results[0];
            const video = { id: nfid, title, img, vtype, synopsis, year, imdbrating } as VideoDto;
            await this.cacheManager.set(`VIDEO:${netflixId}`, JSON.stringify(video), { ttl: 3600 });
            return video;
        }));
    };

    private searchAPI(searchDto: SearchDto, offset: number) {
        return axios({
            method: 'GET',
            url: `https://${this.configService.get('NETFLIX_API_HOST')}/search`,
            params: {
                orderby: 'rating',
                countrylist: '78',
                audio: 'english',
                start_rating: '5',
                offset,
                ...searchDto,
                limit: '100',
            },
            headers: {
                'x-rapidapi-host': this.configService.get('NETFLIX_API_HOST'),
                'x-rapidapi-key': this.configService.get('NETFLIX_API_KEY'),
            },
        });
    }

    private titleAPI(id: string) {
        return axios({
            method: 'GET',
            url: `https://${this.configService.get('NETFLIX_API_HOST')}/title`,
            params: { netflixid: id },
            headers: {
                'x-rapidapi-host': this.configService.get('NETFLIX_API_HOST'),
                'x-rapidapi-key': this.configService.get('NETFLIX_API_KEY'),
            },
        });
    }
}
