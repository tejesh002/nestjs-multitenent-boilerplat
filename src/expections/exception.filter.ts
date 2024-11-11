import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.info(exception);
    if (status === 401) {
      response.status(status).json({
        success: false,
        error: ['Unauthorized'],
      });
    }

    if (status === 422) {
      const error = exception['response']['message'] || exception['response'];

      response.status(status).json({
        success: false,
        error: isArray(error) ? error : [error],
      });
    }

    if (status === 500) {
      response.status(status).json({
        success: false,
        error: ['Internal Server Error'],
      });
    }

    if (status === 400) {
      const error = exception['response']['message'] || exception['response'];

      let errorinfo;
      if (error === 'duplicates') {
        errorinfo = exception['response']['response']['error'];
      }
      response.status(status).json({
        success: false,
        error: isArray(error) ? error : [error],
        message: errorinfo,
      });
    }

    if (status === 403) {
      const error = exception['response']['message'] || exception['response'];

      response.status(status).json({
        success: false,
        error: isArray(error) ? error : [error],
      });
    }

    if (status === 404) {
      const error = exception['response']['message'] || exception['response'];

      response.status(status).json({
        success: false,
        error: isArray(error) ? error : [error],
      });
    }

    if (status === 429) {
      const error = exception['response']['message'] || exception['response'];
      response.status(status).json({
        success: false,
        error: isArray(error) ? error : [error],
      });
    }
  }
}
