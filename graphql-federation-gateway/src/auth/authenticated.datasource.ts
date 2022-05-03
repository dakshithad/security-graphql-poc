import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { User } from './user.type';
import * as fs from 'fs';
import { FormatterOptionsArgs, Row, writeToStream } from '@fast-csv/format';

export class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  private _times = [];
  private _timeout: NodeJS.Timeout;
  willSendRequest({ context, request }: { context: any; request: any }) {
    const user: User = context?.req?.user;
    if (user) {
      request.http.headers.set('x-user-id', user.username);
      request.http.headers.set('x-user-email', user.email);
      request.http.headers.set('x-user-roles', JSON.stringify(user.roles));
      request.http.headers.set('x-user-token', user.token);
      request.http.headers.set('x-user-name', user.name);
    }

    const startTime = context?.req?.authProcessStartTime;
    if (startTime) {
      const endTime = new Date().getTime();
      const totalTime = endTime - startTime;

      console.log(`${this._times.length} - ${totalTime} ms`);
      this._times.push(totalTime);

      clearTimeout(this._timeout);
      this._timeout = setTimeout(async () => {
        await AuthenticatedDataSource.write(
          fs.createWriteStream('times.csv', { flags: 'a' }),
          this._times.map((time) => ({ time })),
          { includeEndRowDelimiter: true },
        );
      }, 2000);
    }
  }

  static write(
    stream: NodeJS.WritableStream,
    rows: Row[],
    options: FormatterOptionsArgs<Row, Row>,
  ): Promise<void> {
    return new Promise((res, rej) => {
      writeToStream(stream, rows, options)
        .on('error', (err: Error) => rej(err))
        .on('finish', () => res());
    });
  }
}
