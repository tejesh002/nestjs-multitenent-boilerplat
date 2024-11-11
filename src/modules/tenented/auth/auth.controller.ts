import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDTO } from './auth.dto';
import { UnAuthService } from './unauth.service';

@Controller('auth')
export class UnAuthController {
  constructor(private readonly unauthservice: UnAuthService) {}

  @Post('signup')
  async signUp(@Body() body: SignUpDTO) {
    return await this.unauthservice.signUp(body);
  }
}
