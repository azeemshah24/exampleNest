import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Delete,
    Put,
    UsePipes,
    HttpCode,
    HttpStatus,
    UseGuards,
    ValidationPipe,
    Patch,
  } from '@nestjs/common';
  import { ZodValidationPipe } from 'src/validation/zodValidation.pipe';
  import { MongoIdValidationPipe } from 'src/validation/mongoIdValidation.pipe';
  import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
  import { AuthGuard } from 'src/global/auth.guard';
  import { QuizService } from '../service/quiz.service'
import { filterValidMongoObjectIdList } from 'src/utils';
import { dateFilterSchema, CreateQuizDto, UpdateQuizDto } from '../dto/index';
import { IQuizByLessonOutcomes } from '../interface/interface';
  
  @ApiTags('Quiz')
  @Controller('quiz')
  export class QuizController {
    constructor(private readonly quizService: QuizService) {}
    // addQuiz
    @Post('/')
    @UsePipes(new ValidationPipe())
    async createQuiz(@Body() createQuizDto: CreateQuizDto) {
        return this.quizService.create(createQuizDto);
    }

    //getAllQuiz
    @Post('/listing')
    @HttpCode(200)
    async getQuizList(@Body() query: any) {
      try {
        const { search, lessonType, page, status, limit, sort, dateParam, rollId } = query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 7;
        const sortBy = sort?.sortBy || 'createdAt';
        const sortDir = sort?.sortDir === 'asc' ? 1 : -1;
        let filteredLessonType=[];
        const rollIdList = rollId;
        // console.log("rollIdListrollIdList===>", rollIdList);
        if(dateParam){
          dateFilterSchema.parse(dateParam)
        }
        if(lessonType){
          filteredLessonType = filterValidMongoObjectIdList(lessonType)
        }
        return this.quizService.getAllQuizes(
          search,
          filteredLessonType,
          pageNumber,
          limitNumber,
          status,
          sortBy,
          sortDir,
          dateParam,
          rollIdList
        );
        
      } catch (error) {
        throw error;
      }
    }

    //getQuizById
    @Get('/:id')
    async getQuiz(@Param('id', MongoIdValidationPipe) quizId: string) {
      return this.quizService.getQuizById(quizId);
    }

    @Post('/by-lesson-outcome')
    @HttpCode(200)
    async getResourceByLessonOutcome(@Body() payload:IQuizByLessonOutcomes ) {
      return this.quizService.getQuizByLessonOutcome(payload);
    }

    // editQuizById
    @Patch('/:id')
    @UsePipes(new ValidationPipe())
    async updateQuiz(
      @Param('id', MongoIdValidationPipe) quizId: string,
      @Body() updateQuizDto: UpdateQuizDto  
    ) {
      await this.quizService.updateQuiz(quizId, updateQuizDto);
      return true;
    }

    @Patch('/update-quiz-linked')
    async updateQuizLinkedStatus( @Body() payload: {quizIds: string[]} ){
      return this.quizService.updateQuizLinkedStatus(payload.quizIds);
    }


   //deleteQuizById
    @Post('/delete')
    async deleteResource(@Body() payload: { quizIds: string[] }): Promise<Boolean> {
    return this.quizService.deleteQuiz(payload.quizIds);
    }
  

  }
  