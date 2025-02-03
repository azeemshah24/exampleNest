export const constants = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_LIMIT: 10,
  MAX_LIMIT: 100,
  ALLOW_IMAGE_FILE: ['image/png', 'image/jpeg'],
  ALLOW_FILE_UPLOAD: ['application/pdf'],
  ALLOW_AUDIO_FILE: ['audio/mp3', 'audio/ogg', 'audio/mpeg', 'audio/wav'],
  ALLOW_VIDEO_FILE: ['video/mp4'],
  Allow_PPT_FILE: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/pptx',
  ],
  ALLOW_ZIP_HTML_FILE: ['application/zip', 'application/html'],
  ALLOW_EXCEL_FILE: [
    'xlsx',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  ],
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
};


export enum FILTER_DATE_OPTION  {
  CUSTOM =  'custom',
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  THISMONTH = 'thisMonth',
  PASTMONTH = 'pastMonth',
  PAST3MONTH = 'past3Months'

}

export enum File_MAX_SIZE {
  "VIDEO/MP4" = 1 * 1000 * 1000 * 1000,
  "VIDEO/WEBM" = 1 * 1000 * 1000 * 1000,
  "IMAGE/PNG" = 10 * 1000 * 1000,
  "IMAGE/JPEG" = 10 * 1000 * 1000,
  "IMAGE/JPG" = 10 * 1000 *1000,
  "DOCUMENT/PDF" = 10 * 1000 * 1000,
  "DOCUMENT/XLSX" = 10 * 1000 * 1000,
  "DOCUMENT/PPT" = 10 * 1000 * 1000,
  "AUDIO/MP3"= 25 * 1000 * 1000,
  "AUDIO/OGG"= 25 * 1000 * 1000,
  "AUDIO/MPEG"= 25 * 1000 * 1000,
  "AUDIO/WAV"= 25 * 1000 * 1000,
  "INTERACTIVE/SCORM" = 100 * 1000 * 1000,
  "INTERACTIVE/FLASH" = 50* 1000 * 1000,
  "DOCUMENT/DOC" = 10 * 1000 * 1000
}

export  const LO_FILTER = ["Board", "Skills", "Grade/Class/Standard", "Subject/Discipline" ]

export const convertMimeTypes: any = {
  'application/vnd.google-apps.document': {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ext: '.docx',
  },
  'application/vnd.google-apps.spreadsheet': {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ext: '.xlsx',
  },
  'application/vnd.google-apps.presentation': {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ext: '.pptx',
  },
};

export enum RESOURCE_TYPE {
  "AUDIO" = "AUDIO",
  "VIDEO" = "VIDEO",
  "DIGITAL" = "DOCUMENT_PRESENTATION",
  "SCROM"  = "SCROM",
  "SWF" = "SWF" 
}


// export enum RESOURCE_TYPEN {
//   "AUDIO" = "AUDIO",
//   "VIDEO" = "VIDEO",
//   "DIGITAL" = "DOCUMENT_PRESENTATION",
//   "SCROM"  = "SCROM",
//   "SWF" = "SWF" 
// }

export enum FILE_TYPE_MAPPING {
  "application/pdf" = RESOURCE_TYPE.DIGITAL,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" = RESOURCE_TYPE.DIGITAL,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" = RESOURCE_TYPE.DIGITAL,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation" = RESOURCE_TYPE.DIGITAL,
  "application/vnd.ms-powerpoint" =  RESOURCE_TYPE.DIGITAL,
  "application/pptx" = RESOURCE_TYPE.DIGITAL,
  "application/vnd.google-apps" = RESOURCE_TYPE.DIGITAL,
}

export enum FILE_UPLOAD_TYPE {
  "THUMBNAIL" = "thumbnail",
  "RESOURCE" = "resource"
}

export const ASSIGNMENT_ATTR = [
  "Class Assignment",
  "Home Assignment",
  "Project"
]

export const ASSESMENT_ATTR = [
  "Assessment"
]

export enum ASSESMENT_FILTER {
  "ASSESED"="assesed",
  "NOT-ASSESED"="not-assesed"
}

