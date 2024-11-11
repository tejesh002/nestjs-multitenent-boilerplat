import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  async findOne(param: any) {
    return { status: 'ACTIVE', refresh_token: '', ...param };
  }
}
