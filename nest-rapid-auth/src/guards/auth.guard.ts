import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { RAPID_AUTH_MODULE_OPTIONS } from '../rapid-auth.constants';
import { RapidAuthModuleOptions } from '../rapid-auth-module-options.interface';
import { RapidUser } from '../model/user.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(RAPID_AUTH_MODULE_OPTIONS)
    private options: RapidAuthModuleOptions,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;

      const headers = request.headers;

      const roles = headers[this.options.authHeaders.roles];
      if (roles) {
        const user = new RapidUser(
          headers[this.options.authHeaders.username],
          headers[this.options.authHeaders.email],
          JSON.parse(roles),
          headers[this.options.authHeaders.name],
          headers[this.options.authHeaders.token],
        );

        request.user = user;

        console.log('user', user.username);

        return true;
      } else {
        console.log(
          'auth headers are invalid',
          this.options.authHeaders,
          headers,
        );
      }
    } else {
      console.log('non grphql request', context);
    }
  }
}
