import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello, this is the backend for Concord at concordapp.us';
    }
}
