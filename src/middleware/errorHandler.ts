import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LoggerService, ResponseService } from '../utils';

import { ZodError, z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { gaxios } from 'google-auth-library';


export const validationErrorSchema = z.object({
  errorCode: z.number(),
  errorMessage: z.string(),
  error: z.array(
    z.object({
      field: z.string(),
      message: z.string(),
    }),
  ),
});
export class RequestValidationError extends createZodDto(
  validationErrorSchema,
) {}

@Catch()
export class ErrorHandler implements ExceptionFilter {
  private responseService: ResponseService;
  private loggerService: LoggerService;
  constructor() {
    this.loggerService = new LoggerService();
    this.responseService = new ResponseService();
  }

  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);
    console.log(exception instanceof gaxios.GaxiosError)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number, message: any, stack: string;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
      stack = exception.stack;
    } else if(exception instanceof ZodError){
      statusCode = 400,
      message = exception.errors;
      stack = exception.stack;
    }else if(exception instanceof gaxios.GaxiosError){
      statusCode = exception.status
      message = exception.status === 404 ?"File not found": exception.message
      stack = exception.stack
    }
    else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    this.loggerService.error(message, stack);
    this.responseService.errorResponse(response, statusCode, message);
  }
}
