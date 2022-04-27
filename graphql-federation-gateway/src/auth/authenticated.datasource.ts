import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { User } from './user.type';

export class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ context, request }: { context: any; request: any }) {
    const user: User = context.req?.user;
    if (user) {
      request.http?.headers.set('x-user-id', user.username);
      request.http?.headers.set('x-user-email', user.email);
      request.http?.headers.set('x-user-roles', JSON.stringify(user.roles));
      request.http?.headers.set('x-user-token', user.token);
      request.http?.headers.set('x-user-name', user.name);
    }
  }
}
