import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuizRepository } from '../repository/quiz.repository';
import { CreateQuizDto, Status } from '../dto/create-quiz.dto';
import { IQuiz, IQuizByLessonOutcomes } from '../interface/interface';
import { convertToMongoObjectId } from 'src/utils';
import mongoose from 'mongoose';
import { UpdateQuizDto } from '../dto';
import { LessonRepository } from 'src/lesson-builder/repositories';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly lessonRepository: LessonRepository,

  ) {}

  async create(createQuizDto: any) {
    createQuizDto.sentForApprovalAt =
    createQuizDto['sentForApprovalAt'] || new Date();
    createQuizDto.approvedOn = createQuizDto['approvedOn'] || new Date();
    createQuizDto.createdBy = createQuizDto['createdBy'] || 1;
    createQuizDto.modifiedBy = createQuizDto['modifiedBy'] || 1;
    createQuizDto.approvedBy = createQuizDto['approvedBy'] || 1;
    createQuizDto.sentForApprovalBy = createQuizDto['sentForApprovalBy'] || 1;
    const quiz = await this.quizRepository.findQuizByName(
      createQuizDto.title,
    );
    if (quiz) {
      throw new HttpException(
        `Quiz with quiz_name = ${createQuizDto.title} already exist`,
        400,
      );
    }
    return this.quizRepository.createQuiz(createQuizDto);
  }

  async getAllQuizes(
    search,
    lessonType,
    page,
    limit,
    status,
    sortBy,
    sortDir,
    dateParam?: {
      option: string;
      range: {
        after: string;
        before: string;
      };
    },
    rollIdList?,
  ) {
    const skip = (page - 1) * limit;

    const count = await this.quizRepository.getQuizCount(
      search,
      lessonType,
      status,
      dateParam,
      rollIdList,
    );
    console.log(count);
    let quizes = await this.quizRepository.getAllQuizes(
      search,
      lessonType,
      skip,
      limit,
      status,
      sortBy,
      sortDir,
      dateParam,
      rollIdList,
    );

    for(let quiz of quizes){
      const quizExist = await this.lessonRepository.checkQuizExist(quiz._id.toString());
      console.log("quizExist", quizExist);
      if(quizExist)
        quiz["is_lesson_plan_exist"]=true;
    }

    return {
      count,
      quizes,
    };
  }

  async getQuizById(quizId: string): Promise<IQuiz | null> {
    const quiz = await this.quizRepository.getQuiz(quizId);
    if (!quiz) {
      throw new NotFoundException('Quiz is not found');
    }
    return quiz;
  }

  async updateQuiz(quizId: string, updateQuizDto: UpdateQuizDto): Promise<Boolean> {
    const quiz = await this.quizRepository.getQuiz(quizId);

    if (!quiz) {
      throw new NotFoundException('Quiz is not found');
    }

    const duplicateQuiz = await this.quizRepository.findQuizByName(
      updateQuizDto.title,
    );
    if (duplicateQuiz && duplicateQuiz._id.toString() !== quizId) {
      throw new HttpException(
        `Quiz with quiz_name = ${updateQuizDto.title} already exist`,
        400,
      );
    }

    await this.quizRepository.updateQuiz(quizId, updateQuizDto);
    return true;
  }

  async duplicate(id: string) {
    const quiz = await this.quizRepository.findOne(id);
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
    const duplicateQuiz: IQuiz = JSON.parse(JSON.stringify(quiz));
    delete duplicateQuiz._id;
    delete duplicateQuiz.createdAt;
    delete duplicateQuiz.updatedAt;
    duplicateQuiz.status = Status.Draft;
    duplicateQuiz.is_deleted = false;
    duplicateQuiz.is_duplicate = true;
    duplicateQuiz.duplicate_of = id;
    duplicateQuiz.copy_count = 0;

    const { duplicateQuizName, parentFound, parentId } =
      await this.findDuplicateName(quiz);

    duplicateQuiz.title = duplicateQuizName;
    if (parentFound) {
      duplicateQuiz.duplicate_of = parentId;
    }

    return this.quizRepository.create(duplicateQuiz);
  }

  async deleteQuiz(quizIds: string[]): Promise<Boolean> {
    const resp = await this.quizRepository.deleteQuiz(quizIds);
    return true;
  }

  async getQuizByLessonOutcome(payload: IQuizByLessonOutcomes){
    const resources = await this.quizRepository.getQuizByLessonOutcomes(payload);
    return resources
  }

  async updateQuizLinkedStatus(quizIds: string[]){
    return this.quizRepository.updateQuizLinkedStatus(quizIds)
  }

  private async findDuplicateName(quiz: IQuiz) {
    if (quiz.is_duplicate && quiz.duplicate_of) {
      const parentQuiz = await this.quizRepository.findOne(quiz.duplicate_of);

      if (parentQuiz) {
        const copyNumber = parentQuiz.copy_count + 1;
        const quizOriginalName = this.findOriginalLessonName(quiz.title);
        const duplicateQuizName = `${quizOriginalName}_copy#${copyNumber}`;
        return {
          duplicateQuizName,
          parentFound: true,
          parentId: quiz.duplicate_of,
        };
      }
    }

    const copyNumber = quiz.copy_count + 1;
    const originalQuizName = this.findOriginalLessonName(quiz.title);
    const duplicateQuizName = `${originalQuizName}_copy#${copyNumber}`;
    return {
      duplicateQuizName,
      parentFound: false,
      parentId: null,
    };
  }

  private findOriginalLessonName(lessonName: string) {
    const parts = lessonName.split('_');
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      if (lastPart.startsWith('copy#')) {
        const originalLessonName = parts.slice(0, parts.length - 1).join('_');
        return originalLessonName;
      }
    }
    return lessonName;
  }
}
