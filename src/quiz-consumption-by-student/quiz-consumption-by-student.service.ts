import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { QuizCompletionByStudent } from './schema/quiz-consumption-by-student.schema';

@Injectable()
export class QuizConsumptionService {
  constructor(
    @InjectModel(QuizCompletionByStudent.name) private quizCompletionByStudentModel: Model<QuizCompletionByStudent>,
  ) { }

  async quizConsumptioByStudent(body: any): Promise<any> {
    const {
      quiz_id,
      course_id,
      student_id,
      lesson_id,
      courseLevelTemplateName,
      courseLevelName,
      status,
      attempt
    } = body;

    try {

      // Check if the record exists based on the provided fields
      const existingRecord = await this.quizCompletionByStudentModel.findOne({
        quiz_id,
        course_id,
        student_id,
        lesson_id,
        courseLevelTemplateName,
        courseLevelName,
      });

      if (existingRecord) {
        // Update the existing record's status
        existingRecord.status = status;

        // Check if the attempt field exists and is an array
        if (Array.isArray(existingRecord.attempt)) {
          // Append the new attempt to the existing array
          existingRecord.attempt.push(attempt);
        } else {
          // Initialize the attempt field as an array with the new attempt
          existingRecord.attempt = [attempt];
        }
        await existingRecord.save();
        return { message: 'Record updated successfully' };
      } else {
        // Insert a new record if it does not exist
        const newRecord = new this.quizCompletionByStudentModel({
          quiz_id,
          course_id,
          student_id,
          lesson_id,
          courseLevelTemplateName,
          courseLevelName,
          status,
          attempt
        });
        await newRecord.save();
        return { message: 'Record inserted successfully' };
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to upsert quiz consumption data');
    }
  }

  async quizConsumptionForTeacherView(body: any): Promise<any> {
    const {
      quiz_id,
      course_id,
      student_id,
      lesson_id,
      courseLevelTemplateName,
      courseLevelName,
    } = body;

    try {

      // Check if the record exists based on the provided fields
      const existingRecord = await this.quizCompletionByStudentModel.findOne({
        quiz_id,
        course_id,
        student_id,
        lesson_id,
        courseLevelTemplateName,
        courseLevelName,
      });
      // console.log("existingRecord=====>", existingRecord);
      return existingRecord || {};

    } catch (error) {
      throw new InternalServerErrorException('Failed to upsert quiz consumption data');
    }
  }  

  // Method to fetch quiz consumption data
  async getQuizConsumptionData(
    course_id: string,
    lesson_id: string,
    student_id: string,
    courseLevelTemplateName: string,
    courseLevelName: string
  ): Promise<any> {
    try {
      let records = await this.quizCompletionByStudentModel.find({
        course_id,
        lesson_id,
        student_id,
      });
      // console.log("records", records);
      if (!records || records.length === 0) {
        // throw new BadRequestException('No records found');
        records = []
      }

      return records;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch quiz consumption data');
    }
  }


  // Method to fetch quizzes with status "submitted"
  async getSubmittedQuizzes(quizIds: string[], course_id, student_id): Promise<any[]> {
    try {
      // Query the database for quizzes matching the provided quizIds and with status "submitted"
      const submittedQuizzes = await this.quizCompletionByStudentModel.find({
        quiz_id: { $in: quizIds },
        status: 'submitted',
        course_id: course_id,
        student_id: student_id
      });

      if (!submittedQuizzes || submittedQuizzes.length === 0) {
        // Return an empty array if no quizzes are found
        return [];
      }

      return submittedQuizzes;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch submitted quizzes');
    }
  }

  // Quiz Consumption for teacher view
  async getQuizesForTeacherView(courseId, lessonId, quizId, courseLevelTemplateName, courseLevelName, studentId) {
    try {
      const existingRecords = await this.quizCompletionByStudentModel.findOne({
        course_id: courseId,
        lesson_id: lessonId,
        quiz_id: quizId,
        student_id: studentId.toString(),
        courseLevelTemplateName: courseLevelTemplateName,
        courseLevelName: courseLevelName,
      });
      return existingRecords || {};
      
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch quiz consumption data for teacher view');
    }
  }

}
