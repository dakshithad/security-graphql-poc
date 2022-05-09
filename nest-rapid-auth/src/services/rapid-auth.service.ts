import { Injectable } from '@nestjs/common';
import { RapidUser } from '../model';

@Injectable()
export class RapidAuthService {
  async getPhone(user: RapidUser) {
    return '000-0000-0000';
  }
}
