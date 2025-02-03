import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, isBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Status } from "../dto/create-quiz.dto";

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
  @IsOptional()
  id: number;

  @IsOptional()
  @IsString()
  attributeName: string;

  @IsOptional()
  attributeValue: any;
  
  @IsOptional()
  @IsString()
  attributeType: string;

  @IsOptional()
  @IsString()
  displayName: string

  @IsOptional()
  @IsString()
  section: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => isMandatory) 
  isMandatory:isMandatory

  @IsOptional()
  @ValidateNested()
  @Type(() => isRequired) 
  isRequired: isRequired

  @IsOptional()
  @IsBoolean()
  isEditable: boolean

  @IsOptional()
  @IsBoolean()
  isDeletable: boolean
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
export class UpdateQuizDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsInt()
  numberOfQuestions: number;

  @IsOptional()
  @IsArray() 
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
  grade: string;


  @IsArray()
  @IsOptional()
  questions: any[]

  @IsOptional()
  @IsString()
  level: string;

  @IsOptional()
  quizDuration: QuizDuration 

  @IsOptional()
  @IsEnum(Status, {message: "status can be either pending, approved, rejected, sent_for_approval, draft"})
  status : Status
}
