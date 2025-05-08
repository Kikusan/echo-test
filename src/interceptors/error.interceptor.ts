import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException, BadRequestException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { NotFoundError, BadRequestError } from '../tools/errors';
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {

        if (err instanceof HttpException) {
          throw err;
        }

        if (err instanceof NotFoundError) {
          throw new NotFoundException(err.message || 'ressource not found');
        }

        if (err instanceof BadRequestError) {
          throw new BadRequestException(err.message || 'Bad request');
        }

        throw new InternalServerErrorException('Internal server error');
      }),
    );
  }
}
