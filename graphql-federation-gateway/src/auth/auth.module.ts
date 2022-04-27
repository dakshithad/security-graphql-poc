import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthConfiguration } from './auth.configuration';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthConfiguration],
  exports: [AuthConfiguration],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
