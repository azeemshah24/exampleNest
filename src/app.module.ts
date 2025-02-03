import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { QuizModule } from "./quiz/quiz.module";
import { QuizStudentConsumptionModule } from './quiz-consumption-by-student/quiz-consumption-by-student.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GlobalModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PG_HOST'),
        port: configService.get<number>('PG_PORT'),
        username: configService.get<string>('PG_USERNAME'),
        password: configService.get<string>('PG_PASSWORD'),
        database: configService.get<string>('PG_DATABASE'),
        entities: [__dirname + '/**/**/*.entity{.ts,.js}'],
        // synchronize: true, // disable this in production
      }),
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/mydatabase'),
    QuizModule,

    QuizStudentConsumptionModule
  ],

  controllers: [AppController],
  providers: [AppService, AuthorizationMiddlewareFactory],
})

export class AppModule {
  constructor(
    private readonly authorizationMiddlewareFactory: AuthorizationMiddlewareFactory,
  ) { }
  configure(consumer: MiddlewareConsumer) {
    if (AUTH_ACTIVE) {
      routes.forEach((route) => {
        const middlewares = [];
        route.authenticate ? middlewares.push(AuthenticationMiddleware) : '';
        route.authorize
          ? middlewares.push(
            this.authorizationMiddlewareFactory.create(route.permissions),
          )
          : '';
        if (middlewares.length) {
          consumer
            .apply(...middlewares)
            .forRoutes({ path: route.path, method: route.method });
        }
      });
    }
  }
}
