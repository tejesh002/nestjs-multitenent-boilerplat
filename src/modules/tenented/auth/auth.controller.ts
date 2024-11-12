import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SignInDTO, SignUpDTO } from './auth.dto';
import { UnAuthService } from './unauth.service';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard, JwtAuthRefreshGuard } from 'src/jwt/jwt-guard';
import { UserDecorator } from 'src/modules/user.decorator';

@Controller('auth')
export class UnAuthController {
  constructor(private readonly unauthservice: UnAuthService) {}

  @Post('signup')
  async signUp(@Body() body: SignUpDTO) {
    return await this.unauthservice.signUp(body);
  }
}

@Controller('v1/auth')
@ApiHeader({
  name: 'x-tenant-id',
  required: true,
  description: 'API_KEY',
})
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('signin')
  async signIn(@Body() body: SignInDTO) {
    return { success: true, ...(await this.authservice.signIn(body)) };
  }

  @Get('me')
  @ApiBearerAuth('USER')
  @UseGuards(JwtAuthGuard)
  async me(@UserDecorator() user) {
    return { success: true, user };
  }

  @Get('refresh')
  @ApiBearerAuth('USER')
  @UseGuards(JwtAuthRefreshGuard)
  async refreshToken(@UserDecorator() user: any) {
    console.info(user);
    return {
      success: true,
      ...(await this.authservice.refreshTokens(
        user['sub'],
        user['refreshToken'],
      )),
    };
  }
}
