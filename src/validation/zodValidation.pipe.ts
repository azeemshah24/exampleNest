import { HttpException, HttpStatus, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schema: ZodSchema,
    private readonly type: string='body'
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      if(this.type === metadata.type){
        const parsedValue = this.schema.parse(value);
        return parsedValue;
      }
      return value;
    } catch (err) {
      const error = err.errors.map((e) => {
        return {
          field: e.path[0],
          message: e.message,
        };
      });
      throw err
    }
  }
}
