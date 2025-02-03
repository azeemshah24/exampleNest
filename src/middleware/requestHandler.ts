import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class RequestHandler implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const inputs = [request.query, request.body, request.params];
    for (const input of inputs) {
      for (const key in input) {
        const value = input[key];
        if (typeof value === 'string' || value instanceof String) {
          input[key] = value.trim();
        }
      }
    }
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: 'successful',
        data: data,
      })),
    );
  }
}
