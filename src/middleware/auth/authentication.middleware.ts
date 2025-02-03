// token-validation.middleware.ts
import {
    HttpException,
    HttpStatus,
    Injectable,
    NestMiddleware,
  } from '@nestjs/common';
  import { ConfigService } from '@nestjs/config';
  import axios from 'axios';
  import { NextFunction, Request, Response } from 'express';
  
  import { LoggerService, ResponseService } from '../../utils';
  
  @Injectable()
  export class AuthenticationMiddleware implements NestMiddleware {
    constructor(
      private readonly configService: ConfigService,
      private responseService: ResponseService,
      private loggerService: LoggerService,
    ) {}
  
    async use(req: Request, res: Response, next: NextFunction) {
      // Extract the token from the Authorization header
      this.loggerService.log(`Executing authentication`);
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new HttpException(
          'Authorization header missing',
          HttpStatus.UNAUTHORIZED,
        );
      }
  
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
      }
  
      // Perform token validation using Axios
      try {
        const response = await axios.post(
          `${this.configService.get<string>('KEYCLOAK_BASE_URL')}/${this.configService.get<string>('ACTIVE_REALM')}/${this.configService.get<string>('KEYCLOCK_PORTAL')}/protocol/openid-connect/token/introspect`,
          new URLSearchParams({
            client_id: this.configService.get('CLIENT_ID'),
            client_secret: this.configService.get('CLIENT_SECRET'),
            token: token as string, // Assert token as string
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            // Ensure that Axios follows redirects
            maxRedirects: 5,
            // Set a timeout for the request (optional)
            timeout: 5000, // 5 seconds timeout
          },
        );
  
        if (!response.data.active) {
          // Token is invalid, return Unauthorized
          delete req?.session[token];
          return this.responseService.sendResponse(
            res,
            HttpStatus.UNAUTHORIZED,
            { status: response.data.active },
            'Unauthorized : Invalid token',
          );
        }
  
        // Add the logged in user email in request body
        req.body.email = response.data.email;
        // Token is valid, proceed to the next middleware or route handler
        next();
      } catch (error) {
        // Handle Axios errors
        delete req?.session[token];
        console.error('Axios error:', error);
        throw new HttpException(
          'Unauthorized: Authentication failed',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
  