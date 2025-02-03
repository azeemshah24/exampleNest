import { Injectable, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class ResponseService {
  private loggerService: LoggerService;
  constructor() {
    this.loggerService = new LoggerService();
  }
  sendResponse(
    @Res() res: Response,
    statusCode: number,
    data: any,
    message: string,
  ) {
    this.loggerService.log(message, {
      status: HttpStatus.OK,
      data: data,
    });
    res.status(statusCode).json({
      status: HttpStatus.OK,
      data: data,
      message: message,
    });
  }

  errorResponse(@Res() res: Response, statusCode: number, message: string) {
    res.status(statusCode).json({
      statusCode: statusCode,
      message: 'failed',
      error: message,
    });
  }
}
