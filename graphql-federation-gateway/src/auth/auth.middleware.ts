import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwksClient } from 'jwks-rsa';
import { AuthConfiguration } from './auth.configuration';
import { User } from './user.type';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private _jwksClient: JwksClient;
  constructor(
    private readonly _authConfig: AuthConfiguration,
    private readonly _jwtService: JwtService,
  ) {
    this._jwksClient = new JwksClient({
      cache: true,
      cacheMaxEntries: 25,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
      jwksUri: _authConfig.jwksUri,
    });
  }

  async use(req: Request | any, res: Response, next: () => void) {
    req.authProcessStartTime = new Date().getTime();
    const bearerHeader = req.headers.authorization;
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];
    let user: User;

    if (!bearerHeader || !accessToken) {
      return next();
    }

    try {
      const { header } = this._jwtService.decode(accessToken, {
        complete: true,
      }) as {
        [key: string]: any;
      };

      const key = await this._jwksClient.getSigningKey(header.kid);
      const publicKey = key.getPublicKey();
      const data = await this._jwtService.verifyAsync(accessToken, {
        publicKey,
        issuer: this._authConfig.authority,
        algorithms: ['RS256'],
      });

      user = new User(
        data.preferred_username,
        data.email,
        data.resource_access[this._authConfig.clientId].roles,
        data.name,
        bearerHeader,
      );
    } catch (error) {
      throw new ForbiddenException('Please register or sign in.');
    }

    if (user) {
      req.user = user;
    }
    next();
  }
}
