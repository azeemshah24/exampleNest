import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LogsModule } from 'src/log-module/schema/logs-module.schema';
import { LogsModuleRepository } from '../../log-module/repositories/log-module.repository';
// import { Question } from '../schema/question-model.schema';
import { FILTER_DATE_OPTION } from '../../constants/index';
import { Quiz } from '../schema/quiz.schema';
import { CreateQuizDto } from "../dto/create-quiz.dto";
import { IQuiz, IQuizByLessonOutcomes } from "../interface/interface";
import { convertToMongoObjectId } from 'src/utils';
import { filterDate } from "../../utils/dateFilter";
import { UpdateQuizDto } from '../dto';
import { Lesson } from 'src/lesson-builder/schemas/lesson.schema';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
  ) {}

  async createQuiz(createQuizDto:any){
    const createdQuiz = new this.quizModel(createQuizDto);
    return await createdQuiz.save();
  }


  async findQuizByName(quizName: string): Promise<IQuiz| null> {
    return this.quizModel.findOne({ title: {$regex: new RegExp(quizName, 'i')}, is_deleted: false });
  }


  async getQuizCount(
    search: string,
    lessonType: string | string[],
    status: string | string[],
    dateParam?: {
      option: string;
      range: {
        after: string;
        before: string;
      };
    },
    rollIdList?
  ) {
    status = status ? (Array.isArray(status) ? status : [status]) : [];
    lessonType = lessonType
      ? Array.isArray(lessonType)
        ? lessonType
        : [lessonType]
      : [];

    const matchConditions: any = {
      is_deleted: false,
    };

    if(rollIdList && rollIdList.length > 0 ){
      rollIdList.includes(2)?matchConditions.status={...matchConditions.status, $ne: "draft"}:"";
    }

    if (search) {
      matchConditions.title = { $regex: new RegExp(search, 'i') };
    }

    if (status.length > 0) {
      matchConditions.status = { $in: status };
    }

    if (lessonType.length > 0) {
      const objectIdLessonType = lessonType.map((ct: string) =>
        convertToMongoObjectId(ct),
      );
      matchConditions['lesson_type'] = { $in: objectIdLessonType };
    }

    if (dateParam) {
      if (dateParam.option) {
        matchConditions['createdAt'] = filterDate(dateParam);
      }
    }
    console.log("matchConditions===>", matchConditions)
    const count = await this.quizModel
      .aggregate([
        {
          $match: matchConditions,
        },
        {
          $lookup: {
            from: 'lessontypes',
            localField: 'lesson_type',
            foreignField: '_id',
            as: 'lesson_type_info',
          },
        },
        {
          $unwind: {
            path: '$lesson_type',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $count: 'count',
        },
      ])
      .exec();

    return count.length > 0 ? count[0].count : 0;
  }

  async getAllQuizes(
    search,
    lessonType,
    skip,
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
    rollIdList?
  ): Promise<IQuiz[]> {
    status = status ? (Array.isArray(status) ? status : [status]) : [];
    lessonType = lessonType
      ? Array.isArray(lessonType)
        ? lessonType
        : [lessonType]
      : [];

    const matchConditions: any = {
      is_deleted: false,
      // status:"approved"
    };

    if(rollIdList && rollIdList.length > 0 ){
      rollIdList.includes(2)?matchConditions.status={...matchConditions.status, $ne: "draft"}:"";
    }

    if (search) {
      matchConditions.title = { $regex: new RegExp(search, 'i') };
    }

    if (status.length > 0) {
      matchConditions.status = { $in: status };
    }

    if (lessonType.length > 0) {
      const objectIdLessonType = lessonType.map((ct: string) =>
        convertToMongoObjectId(ct),
      );
      matchConditions['lesson_type'] = { $in: objectIdLessonType };
    }

    if (dateParam) {
      if (dateParam.option) {
        matchConditions['createdAt'] = filterDate(dateParam);
      }
    }
    return this.quizModel
      .aggregate([
        {
          $match: matchConditions,
        },
        {
          $sort: { [sortBy]: sortDir },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $project: {
            _id: 1,
            title: 1,
            status: 1,
            numberOfQuestions: 1,
            skill:1,
            grade:1,
            is_lesson_plan_exist: 1,
            board:1,
            lesson_outcomes:1,
            subject: 1,
            level:1,
            questions:1,
            sentForApprovalAt: 1,
            quizDuration: 1,
            approvedOn: 1,
            createdBy: 1,
            modifiedBy: 1,
            approvedBy: 1,
            sentForApprovalBy: 1,
            is_deleted: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1,
          },
        },
      ])
      .exec();
  }

  async getQuiz(quizId: string): Promise<IQuiz | null> {
    const quizes = await this.quizModel
      .aggregate([
        {
          $lookup: {
            from: 'lessontypes',
            localField: 'lesson_type',
            foreignField: '_id',
            as: 'lesson_type_info',
          },
        },
        {
          $unwind: {
            path: '$lesson_type_info',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            _id: new Types.ObjectId(quizId),
            is_deleted: false,
          },
        },
        {
          $addFields: {
            lesson_type_name: '$lesson_type_info.lesson_name',
          },
        },
        {
          $project: {
            lesson_type_info: 0,
          },
        },
      ])
      .exec();

    if (quizes && quizes.length === 0) {
      return null;
    } else {
      let quiz = quizes[0];
      return quiz;
    }
  }

  async updateQuiz(quizId: string, updateQuizDto: UpdateQuizDto): Promise<Boolean> {
    let res = await this.quizModel
      .findOneAndUpdate({ _id: quizId, is_deleted: false }, updateQuizDto, {
        new: true,
      })
      .exec();
    return true;
  }
  
  async findOne(id: string): Promise<IQuiz> {
    return this.quizModel.findOne({
      _id: id,
      is_deleted: false,
    })
  }

  async create(createQuizDto: CreateQuizDto){
    const createdQuiz = new this.quizModel(createQuizDto);
    const result = await createdQuiz.save();
    if (createdQuiz.duplicate_of) {
      await this.quizModel
        .findOneAndUpdate(
          { _id: createdQuiz.duplicate_of },
          { $inc: { copy_count: 1 } },
        )
        .exec();
    }
    return result;
  }

  async deleteQuiz(quizIds: string[]): Promise<Boolean>{
    let res = await this.quizModel
      .updateMany(
        { _id: quizIds, is_deleted: false },
        { is_deleted: true },
      )
      .exec();
      return res ? true:false 

  }

  async getQuizByLessonOutcomes(payload: IQuizByLessonOutcomes){
    console.log("payload===>", payload);
    const { board, grade, lesson_outcomes, level ,skill , subject , search} = payload;
    let matchCondition:any = {
      "$and":[
        {
          "$or":[]
        },
        // {
        //   is_deleted: false,
        //   status:"approved"
        // },
      ]
    }
    if(search){
      matchCondition.$and.push({
        title: { $regex: new RegExp(search, 'i') }
      })
    }
    if(board){
      console.log(matchCondition[0])
      matchCondition["$and"][0]["$or"].push({board: {
        $in:board
      }});
    }
    if(grade){
      matchCondition["$and"][0]["$or"].push({grade: {
        $in: grade
      }})
    }
    if(lesson_outcomes && lesson_outcomes.length > 0){
      matchCondition["$and"][0]["$or"].push({lesson_outcomes: {
        $in: lesson_outcomes
      }})
    }
    if(skill){
      matchCondition["$and"][0]["$or"].push({skill: {
        $in: skill
      }})
    }
    if(level){
      matchCondition["$and"][0]["$or"].push({level: {
        $in: level
      }})
    }
    if(subject){
      matchCondition["$and"][0]["$or"].push({subject: {
        $in: subject
      }})
    }

    return this.quizModel.aggregate([
      {
        $match: {...matchCondition, is_deleted: false,status:"approved"}
      }
    ])
  }
  async updateQuizLinkedStatus(quizIds:string[]){
    const res =  await this.quizModel.updateMany(
      { _id: quizIds, is_lesson_plan_exist: true },
    );
    
    return res ? true: false;
  }
  async getQuizFromLessonPlan(quizIds: string[]){
    return this.quizModel.find({_id:{$in:quizIds}}).select({_id:1, title:1, lesson_outcomes:1, questions:1, quizDuration: 1}).lean()
  }

  async updateQuizLessonPlanLinked(quizIdsSelected: string[], lessonId: string, deletedQuizIds: string[]){
    
    if(quizIdsSelected && quizIdsSelected.length > 0 && deletedQuizIds.length === 0){
      await this.quizModel.updateMany(
        { _id: {$in:quizIdsSelected}}, {$push:{linked_lesson_plan:lessonId} },
      );
    }

    if(quizIdsSelected && quizIdsSelected.length > 0 && deletedQuizIds.length > 0){
      await this.quizModel.updateMany({_id: {$in:deletedQuizIds} })
    }

    // if(quizIdsDeselected && quizIdsDeselected.length > 0){
    //   await this.quizModel.updateMany(
    //     { _id: quizIdsDeselected}, {$inc: {lesson_plan_linked_count: -1} },
    //   );
    // }
    return true
  }
}
