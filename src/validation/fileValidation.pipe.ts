import { PipeTransform, Injectable, ArgumentMetadata, HttpException } from '@nestjs/common';
import { File_MAX_SIZE } from "../constants/index";

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any) {
    console.log(value);
    let errorMsg = `File size exceeded expected`
    switch(value.mimetype){
        case 'video/mp4':
            if((value.size > File_MAX_SIZE['VIDEO/MP4']))
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['VIDEO/MP4']/(1000*1000)} MB`, 400);
            return value
        case 'image/png':
            if((value.size > File_MAX_SIZE['IMAGE/PNG']))
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['IMAGE/PNG']/(1000*1000)} MB`, 400);
            return value
        case 'image/jpeg':
            if((value.size > File_MAX_SIZE['IMAGE/JPEG']))
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['IMAGE/JPEG']/(1000*1000)} MB`, 400);
            return value
        case 'image/jpg':
            if((value.size > File_MAX_SIZE['IMAGE/JPG']))
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['IMAGE/JPG']/(1000*1000)} MB`, 400);
            return value
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            if(value.size > File_MAX_SIZE['DOCUMENT/XLSX'])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['DOCUMENT/XLSX']/(1000*1000)} MB`, 400)
        case 'application/pdf': 
            if(value.size > File_MAX_SIZE['DOCUMENT/PDF'])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['DOCUMENT/PDF']/(1000*1000)} MB`, 400);
            return value
        case 'application/vnd.ms-powerpoint':
            if(value.size > File_MAX_SIZE['DOCUMENT/PPT'])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['DOCUMENT/PPT']/(1000*1000)} MB`, 400);
            return value
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            if(value.size > File_MAX_SIZE['DOCUMENT/PPT'])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['DOCUMENT/PPT']/(1000*1000)} MB`, 400);
            return value
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            if(value.size > File_MAX_SIZE['DOCUMENT/DOC'])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['DOCUMENT/DOC']/(1000*1000)} MB`, 400);
            return value
        case 'application/msword':
            if(value.size > File_MAX_SIZE['DOCUMENT/DOC'])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['DOCUMENT/DOC']/(1000*1000)} MB`, 400);
            return value
        case 'audio/mp3':
            if(value.size > File_MAX_SIZE['AUDIO/MP3'])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['AUDIO/MP3']/(1000*1000)} MB`, 400);
            return value
        case 'application/x-shockwave-flash':
            if(value.size > File_MAX_SIZE["INTERACTIVE/FLASH"])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['INTERACTIVE/FLASH']/(1000*1000)} MB`, 400);
            return value
        case 'application/vnd.adobe.flash.movie':
            if(value.size > File_MAX_SIZE["INTERACTIVE/FLASH"])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['INTERACTIVE/FLASH']/(1000*1000)} MB`, 400);
            return value
                
        case 'audio/ogg':
            if(value.size > File_MAX_SIZE['AUDIO/OGG'])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['AUDIO/OGG']/(1000*1000)} MB`, 400);
            return value
        case 'audio/mpeg':
            if(value.size > File_MAX_SIZE['AUDIO/MPEG'])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['AUDIO/MPEG']/(1000*1000)} MB`, 400);
            return value
        case 'audio/wav':
            if(value.size > File_MAX_SIZE['AUDIO/WAV'])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['AUDIO/WAV']/(1000*1000)} MB`, 400);
            return value
        case 'application/zip':
            if(value.size > File_MAX_SIZE['INTERACTIVE/SCORM'])
                throw new HttpException(`${errorMsg} ${File_MAX_SIZE['INTERACTIVE/SCORM']/(1000*1000)} MB`, 400);
            return value
        default:
            throw new HttpException(`File with mime_type ${value.mimetype} is not accepted`, 400)
        }

  }
}