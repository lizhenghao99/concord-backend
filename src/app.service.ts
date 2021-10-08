import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello() {
        return { content: 'Hello, this is the backend for Concord at https://concordapp.us' };
    }
}
