import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`${value} is not a valid MongoDB ObjectId`);
    }
    return value;
  }
}
