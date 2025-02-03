import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { QuizService } from './service/quiz.service';
import { QuizController } from './controller/quiz.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      
      
    ])
  ],
  controllers: [QuizController],
  providers: [QuizService, QuizRepository, LessonRepository, LogsModuleRepository, UserRepository, ResourceRepository],
})
export class QuizModule { }
