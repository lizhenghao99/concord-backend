import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    private logger = new Logger('RequestLogger', { timestamp: true });

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.verbose('--------------------');
        this.logger.verbose(
            `Incoming request: ${req.method} ${req.originalUrl}`,
        );
        this.logger.verbose(
            `From IP: ${req.ip} Agent: ${req.get('UserEntity-Agent')}`,
        );
        this.logger.verbose(`Request body: ${JSON.stringify(req.body)}`);
        res.on('finish', () => {
            this.logger.verbose(`Request handled`);
        });
        next();
    }
}
