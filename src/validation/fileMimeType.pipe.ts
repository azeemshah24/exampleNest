import { PipeTransform, Injectable, ArgumentMetadata, HttpException } from '@nestjs/common';
import { FILE_UPLOAD_TYPE } from "../constants/index";

@Injectable()
export class FileMimeValidationPipe implements PipeTransform {
  transform(value: any) {
    console.log("value===>", value);
    console.log(value.upload_method === FILE_UPLOAD_TYPE["THUMBNAIL"]);
    let errorMsg = `File size exceeded expected`
    if(value.upload_method === FILE_UPLOAD_TYPE["THUMBNAIL"]){
        switch(value.mimetype){
            case 'image/jpeg':
                return true
            case 'image/jpg':
                return true
            case  'image/png':
                return true
            default:
                throw new HttpException(`file type ${value.mimetype} not allowed for thumbail image/url`, 400)
            
        }
    }

    if(value.upload_method === FILE_UPLOAD_TYPE["RESOURCE"]){
        switch (value.mimetype) {
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                return true
            case "application/vnd.ms-powerpoint":
                return true
            case "application/pptx":
                return true
            case "application/pdf":
                return true
            case "application/zip":
                return true
            case "application/x-shockwave-flash":
                return true
            case "application/vnd.adobe.flash.movie":
                return true
            case "audio/mpeg":
                return true
            case "audio/wav":
                return true
            case "audio/ogg":
                return true
            case "video/mp4":
                return true
            default:
                throw new HttpException(`file type ${value.mimetype} not allowed resource image/url`, 400);
        }

    }

  }
}