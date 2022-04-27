import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthConfiguration {
  public userPoolId: string = process.env.AWS_COGNITO_USERPOOL_ID;
  public region: string = process.env.AWS_COGNITO_REGION;
  public clientId = 'poc-test-client';
  public authority = 'http://localhost:8080/realms/security-poc';
  public jwksUri =
    'http://localhost:8080/realms/security-poc/protocol/openid-connect/certs';
}
