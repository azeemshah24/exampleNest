import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class QuizCompletionByStudent extends Document {

  @Prop({ type: String })
  student_id: string;

  @Prop({ type: String })
  course_id: string;

  @Prop({ type: String })
  quiz_id: string;

  @Prop({ type: String })
  lesson_id: string;

  @Prop({ type: String })
  courseLevelTemplateName: string;

  @Prop({ type: String })
  courseLevelName: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: [mongoose.Schema.Types.Mixed], default: [] })
  attempt?: Record<string, any>[];
}

export const QuizCompletionByStudentProgressSchema = SchemaFactory.createForClass(QuizCompletionByStudent)
