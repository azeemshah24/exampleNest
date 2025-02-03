import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Get,
  Query,
} from '@nestjs/common';
import { QuizConsumptionService } from './quiz-consumption-by-student.service';

@Controller('quiz-student-consumption')
export class QuizConsumptionByStudentController {
  constructor(private readonly quizConsumptionService: QuizConsumptionService) { }

  // POST route to upsert teacher's video progress
  @Post('quiz-consumption-by-student')
  async upsertStudentQuizProgress(@Body() body: any) {
    try {
      const {
        quiz_id,
        course_id,
        student_id,
        lesson_id,
        courseLevelTemplateName,
        courseLevelName,
        status
      } = body;

      // Check for required fields
      if (
        !quiz_id ||
        !course_id ||
        !student_id ||
        !lesson_id ||
        !courseLevelTemplateName ||
        !courseLevelName ||
        !status
      ) {
        throw new BadRequestException('Missing required fields');
      }

      // Call the service method to upsert the progress data
      const result = await this.quizConsumptionService.quizConsumptioByStudent(body);

      return result
    } catch (error) {
      console.log("errorrrrr", error);
      throw new InternalServerErrorException('Failed to upsert quiz data');
    }
  }


  // GET route to fetch quiz consumption data based on course_id, lesson_id, and student_id
  @Get('get-quiz-consumption')
  async getQuizConsumptionData(
    @Query('course_id') course_id: string,
    @Query('lesson_id') lesson_id: string,
    @Query('student_id') student_id: string,
    @Body() body: { courseLevelTemplateName: string; courseLevelName: string },
  ) {
    try {
      const { courseLevelTemplateName, courseLevelName } = body;
      // Check for required query parameters
      if (!course_id || !lesson_id || !student_id) {
        throw new BadRequestException('Missing required query parameters');
      }

      // Call the service method to fetch the data
      const result = await this.quizConsumptionService.getQuizConsumptionData(
        course_id,
        lesson_id,
        student_id,
        courseLevelTemplateName, 
        courseLevelName
      );

      return result;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException('Failed to fetch quiz consumption data');
    }
  }

}
