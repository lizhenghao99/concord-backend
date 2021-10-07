import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ExampleEntity } from './example.entity';
import { ExampleService } from './example.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('example')
@Controller('example')
@UseGuards(AuthGuard(['jwt', 'cookie']))
export class ExampleController {
    constructor(private exampleService: ExampleService) {
    }

    @Get()
    list(): Promise<ExampleEntity[]> {
        return this.exampleService.list();
    }

    @Post()
    create(@Body() body: CreateExampleDto): Promise<ExampleEntity> {
        return this.exampleService.create(body.name);
    }
}
