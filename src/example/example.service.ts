import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExampleRepository } from './example.repository';
import { ExampleEntity } from './example.entity';

@Injectable()
export class ExampleService {
    constructor(
        @InjectRepository(ExampleRepository)
        private exampleRepository: ExampleRepository,
    ) {
    }

    list(): Promise<ExampleEntity[]> {
        return this.exampleRepository.find();
    }

    async create(name: string): Promise<ExampleEntity> {
        const example = this.exampleRepository.create({
            name: name,
        });
        await this.exampleRepository.save(example);
        return example;
    }
}
