import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorHandler } from './middleware';
import { RequestHandler } from './middleware';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { constants } from './utils/constant';
import { ZodValidationPipe } from 'nestjs-zod';
import { patchNestJsSwagger } from 'nestjs-zod';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as cookieParser from "cookie-parser";
declare global {
  namespace Express {interface Request {
      session: any; // Adjust the type according to your session implementation
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  app.enableCors();
  app.use(helmet());
  app.use(cookieParser());

  // Configure body-parser to handle large payloads
  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

  const options = new DocumentBuilder()
    .setTitle(constants.SWAGGER_API_NAME)
    .setBasePath(constants.SWAGGER_API_BASE_PATH)
    .setDescription(constants.SWAGGER_API_DESCRIPTION)
    .setVersion(constants.SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'Authorization',
    )
    .build();
  patchNestJsSwagger();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(constants.SWAGGER_API_ROOT, app, document);
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new RequestHandler());
  app.useGlobalFilters(new ErrorHandler());
  
  await app.listen(3000);
}
bootstrap();
