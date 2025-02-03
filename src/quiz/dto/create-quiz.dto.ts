import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, isBoolean, IsDateString, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf, ValidateNested } from 'class-validator';

// const AttributeValuesValidation = z.object({
//   id: z.number().min(1),
//   attributeName: z.string(),
//   attributeValue: z.any(),
//   attributeType: z.string(),
//   displayName: z.string(),
//   section: z.string().optional(),
//   isMandatory: z.object({
//     checked: z.boolean(),
//     disabled: z.boolean(),
//   }),
//   isRequired: z.object({
//     checked: z.boolean(),
//     disabled: z.boolean(),
//   }),
//   isEditable: z.boolean(),
//   isDeletable: z.boolean(),
//   // value: z.any()
// });

class isMandatory {
  @IsBoolean()
  checked: boolean

  @IsBoolean()
  disabled: boolean
}

class isRequired {
  @IsBoolean()
  checked: boolean

  @IsBoolean()
  disabled: boolean
}

class AttributeValuesValidation {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  attributeName: string;

  attributeValue: any;
  
  @IsString()
  attributeType: string;

  @IsString()
  displayName: string

  @IsOptional()
  @IsString()
  section: string;

  @ValidateNested()
  @Type(() => isMandatory) 
  isMandatory:isMandatory

  @ValidateNested()
  @Type(() => isRequired) 
  isRequired: isRequired

  @IsBoolean()
  isEditable: boolean

  @IsBoolean()
  isDeletable: boolean
}

export enum Status {
    Pending = 'pending',
    Approved = 'approved',
    SentForApproval = 'sent_for_approved',
    Rejected = 'rejected',
    Draft = 'draft',
}


class Question {
  

  @IsString()
  @IsNotEmpty()
  _id:string;

  @IsNotEmpty()
  @IsString()
  question_name: string;

  @IsNotEmpty()
  @IsString()
  question_type: string;

  @IsNotEmpty()
  @IsString()
  question_difficulty_level: string

  @IsNotEmpty()
  @IsString()
  answer: string
}

class QuizDuration {
  @IsNotEmpty()
  @IsInt()
  hours: number;

  @IsNotEmpty()
  @IsInt()
  minutes: number
}
export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @ValidateIf(o=>o.status!==Status.Draft)
  @IsNotEmpty()
  @IsInt()
  numberOfQuestions: number;

  @ValidateIf(o=>o.status!==Status.Draft)
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty() 
  lesson_outcomes: string[];

  @IsOptional()
  @IsString()
  skill: string;

  @IsOptional()
  @IsString()
  board: string;

  @IsOptional()
  @IsString()
  subject: string;


  @IsOptional()
  @IsString()
  level: string;


  @IsOptional()
  @IsString()
  grade: string;

  @ValidateIf(o=>o.status!==Status.Draft)
  @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Question)
  questions: any[]

  @ValidateIf(o=>o.status!==Status.Draft)
  quizDuration: QuizDuration 

  @IsEnum(Status, {message: "status can be either pending, approved, rejected, sent_for_approval, draft"})
  status : Status
}
