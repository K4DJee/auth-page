import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { timeStamp } from "console";
import { Response } from "express";

@Catch()
export class AllExceptionsFiler implements ExceptionFilter{
    private readonly logger = new Logger(AllExceptionsFiler.name)
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse() as Response;
        const status = exception instanceof HttpException ? exception.getStatus() : 500;
        const message = exception instanceof HttpException ? exception.message : 'Internal Server Error';
        this.logger.error(message, exception);
        response.status(status).json({
            status, message, timeStamp: new Date().toISOString(),
            path: ctx.getResponse().url,
        })
    }
}