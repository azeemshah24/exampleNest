import { Status } from "../dto/create-quiz.dto";

interface IQuestion {
  _id: string;
  
  question_name: string;

  question_type: string;

  question_difficulty_level: string
  answer: string;
}
export interface IQuiz {
  _id: string;
  title: string;
  status: Status;
  lesson_type: string;
  numberOfQuestions: number;
  lesson_type_name: string;
  grade: string;
  lesson_outcomes:string[];
  questions: any[]
  skill: string; 
  board: string; 
  subject: string;
  level: string;
  sentForApprovalAt: Date;
  approvedOn: Date;
  createdBy: number;
  modifiedBy: number;
  approvedBy: number;
  sentForApprovalBy: number;
  quizDuration: {
    hours: number;
    minutes: number

  }
  is_duplicate: boolean;
  duplicate_of: string;
  copy_count: number;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface IQuizByLessonOutcomes {
  search:string,
  lesson_outcomes:string[],
  skill: string[],
  level: string[],
  board: string[],
  grade: string[],
  subject: string,
}
