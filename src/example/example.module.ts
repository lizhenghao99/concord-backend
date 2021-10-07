import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleRepository } from './example.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([ExampleRepository]), AuthModule],
    controllers: [ExampleController],
    providers: [ExampleService],
})
export class ExampleModule {
}
