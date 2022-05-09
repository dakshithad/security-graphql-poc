import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { RapidUser } from '../model';

@Injectable({ scope: Scope.REQUEST })
export class RapidAuthService {
  constructor(@Inject(CONTEXT) private context: any) {}

  getCurrentUser(): RapidUser {
    const request = this.context.req;
    if (request) {
      return request?.user as RapidUser;
    }
  }
}
