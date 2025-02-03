import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizConsumptionService } from './quiz-consumption-by-student.service';
import { QuizCompletionByStudent, QuizCompletionByStudentProgressSchema } from './schema/quiz-consumption-by-student.schema';
import { QuizConsumptionByStudentController } from './quiz-consumption-by-student.controller';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizCompletionByStudent.name, schema: QuizCompletionByStudentProgressSchema },
    ])
  ],
  controllers: [QuizConsumptionByStudentController],
  providers: [
    QuizConsumptionByStudentController, QuizConsumptionService
  ],
})
export class QuizStudentConsumptionModule { }
