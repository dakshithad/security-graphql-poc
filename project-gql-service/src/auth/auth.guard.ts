import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { User } from './user.type';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;

      const headers = request.headers;

      const user = new User(
        headers['x-user-id'],
        headers['x-user-email'],
        JSON.parse(headers['x-user-roles']),
        headers['x-user-name'],
        headers['x-user-token'],
      );

      request.user = user;

      console.log('user-id', user.username);

      return true;
    }
  }
}
