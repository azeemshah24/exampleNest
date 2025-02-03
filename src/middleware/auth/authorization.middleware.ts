import {
    HttpException,
    HttpStatus,
    Injectable,
    NestMiddleware,
  } from '@nestjs/common';
  import { NextFunction, Request, Response } from 'express';
  
  import {
    APPLICATION_ID,
    LoggerService,
    MDM_API_URLS,
    MdmService,
    ResponseService,
    SERVICE_NAME,
  } from '../../utils';
  
  @Injectable()
  export class AuthorizationMiddleware implements NestMiddleware {
    private responseService = new ResponseService();
    private mdmService = new MdmService();
    private loggerService = new LoggerService();
    public routePermission: string | string[];
    constructor(permission: string | string[]) {
      this.routePermission = permission;
    }
  
    async use(req: Request, res: Response, next: NextFunction) {
      try {
        this.loggerService.log(`Executing authorization`);
        const loggedInUserEmail = req.body?.email ?? null;
        if (loggedInUserEmail) delete req.body?.email;
  
        const permissionsApiResponse = await this.mdmService.postDataToAPI(
          `${MDM_API_URLS.RBAC_USER_PERMISSION}`,
          {
            user_email: loggedInUserEmail,
            application_id: APPLICATION_ID,
            service: SERVICE_NAME,
          },
        );
        const { permissions: userPermissions, userInfo } =
          permissionsApiResponse.data;
  
        let userId = null;
        let userName = null;
        let userEmail = null;
  
        if (userInfo) {
          userId = userInfo?.id ? userInfo.id : null;
          userName = userInfo?.name ? userInfo.name : null;
          userEmail = userInfo?.email ? userInfo.email : null;
        }
  
        if (this.routePermission !== '*' && Array.isArray(this.routePermission)) {
          let userHasApiPermission = false;
          this.routePermission.forEach((permission) => {
            if (userPermissions.includes(permission)) {
              userHasApiPermission = true;
            }
          });
  
          if (!userHasApiPermission) {
            throw new HttpException(
              'User does not have permission to accept this API',
              HttpStatus.BAD_REQUEST,
            );
          }
        }
        req.body = {
          ...req.body,
          created_by: {
            user_id: userId,
            user_name: userName,
            email: userEmail,
          },
        };
        next();
      } catch (error: Error | unknown) {
        console.log(error);
        this.responseService.errorResponse(
          res,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong while checking authorization',
        );
        throw new HttpException(
          'Something went wrong while checking authorization',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  