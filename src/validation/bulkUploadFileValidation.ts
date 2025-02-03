import { PipeTransform, Injectable, ArgumentMetadata, HttpException } from '@nestjs/common';
import { File_MAX_SIZE } from "../constants/index";

@Injectable()
export class BulkUploadFileTypeValidationPipe implements PipeTransform {
  transform(value: any) {
    console.log(value);
    switch(value.mimetype){
        case 'text/csv':
            return value
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return value
        default:
            throw new HttpException(`File with mime_type ${value.mimetype} is not accepted`, 400)
        }
  }
}