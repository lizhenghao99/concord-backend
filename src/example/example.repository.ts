import { EntityRepository, Repository } from 'typeorm';
import { ExampleEntity } from './example.entity';

@EntityRepository(ExampleEntity)
export class ExampleRepository extends Repository<ExampleEntity> {
}
