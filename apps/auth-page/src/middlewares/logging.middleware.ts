import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware{
    private readonly logger = new Logger('HTTP');
    use(req: Request, res: Response, next: NextFunction): void {
        const {method, originalUrl, ip} =  req;
        const userAgent = req.get['user-agent'] || '';

        this.logger.log(`${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`)

        const startTime = Date.now();
        res.on('finish', ()=>{
            const {statusCode} = res;
            const contentLength = res.get('content-length') || '';
            const duration = Date.now() - startTime;

            this.logger.log(
                `${method} ${originalUrl} ${statusCode} ${contentLength} ${duration}ms`
            )
        });

        next();
    }
}