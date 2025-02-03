import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from "mongoose";


@Schema({ timestamps: true })
class IsMandatory extends Document {
  @Prop()
  checked: boolean;

  @Prop()
  disabled: boolean;
}

@Schema({ timestamps: true })
class IsRequired extends Document {
  @Prop()
  checked: boolean;

  @Prop()
  disabled: boolean;
}

@Schema({ timestamps: true, _id: true })
export class AttributeValues extends Document {
  @Prop()
  attributeName: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  attributeValue: any;

  @Prop()
  displayName: string;

  @Prop()
  attributeType: string;

  @Prop()
  section?: string;

  @Prop({ type: IsMandatory })
  isMandatory: IsMandatory;

  @Prop({ type: IsRequired })
  isRequired: IsRequired;

  @Prop()
  isEditable: boolean;

  @Prop()
  isDeletable: boolean;
}

@Schema()
export class QuestionValues extends Document {

  @Prop()
  _id: mongoose.Types.ObjectId;
  
  @Prop()
  question_name: string;

  @Prop()
  question_type: string;

  @Prop()
  question_difficulty_level: string

  @Prop()
  answer: string;
}
@Schema()
class QuizDuration {
  @Prop()
  hours: number;

  @Prop()
  minutes: number
}

@Schema({ timestamps: true})
export class Quiz extends Document {
  @Prop()
  title: string;

  @Prop()
  lesson_outcomes: string[];

  @Prop()
  numberOfQuestions: number;

  @Prop()
  skill: string;

  @Prop()
  board: string;

  @Prop()
  subject: string;

  @Prop()
  level: string;

  @Prop()
  grade: string;

  @Prop()
  status:string;

  @Prop({ default: [] })
  questions: []

  @Prop()
  quizDuration: QuizDuration

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ type: Date })
  approvedOn: Date;

  @Prop()
  createdBy: string;

  @Prop()
  modifiedBy: number;

  @Prop()
  approvedBy: number;

  @Prop()
  sentForApprovalBy: number;

  @Prop({default: false})
  is_lesson_plan_exist : boolean

  @Prop({default: 0})
  lesson_plan_linked_count: number

  @Prop({ type: Boolean, default: false })
  is_duplicate: boolean;
  
  @Prop({ type: String, default: '' })
  duplicate_of: string;

  @Prop({ type: Number, default: 0 })
  copy_count: number;
  
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
