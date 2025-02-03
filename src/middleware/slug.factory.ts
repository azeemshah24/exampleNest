import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SlugMiddleware } from './slug.middleware';
import { ConfigService } from '@nestjs/config';
import { ResponseService } from 'src/utils';

export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

@Injectable()
export class SlugMiddlewareFactory {
  constructor(private readonly configService: ConfigService,private responseService: ResponseService){};
  create(customValue: string): MiddlewareFunction {
    console.log(customValue);
    return (req, res, next) => {
      const middleware = new SlugMiddleware(customValue,this.configService,this.responseService);
      middleware.use(req, res, next);
    };
  }
}