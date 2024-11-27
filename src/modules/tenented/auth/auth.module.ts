import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  JwtAccessRefreshTokenStrategy,
  JwtAccessTokenStrategy,
} from 'src/jwt/jwt-strategy';
import { UserModule } from 'src/modules/tenented/user/user.module';
import { AuthController, UnAuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnAuthService } from './unauth.service';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [UnAuthController, AuthController],
  providers: [
    UnAuthService,
    AuthService,
    JwtAccessTokenStrategy,
    JwtAccessRefreshTokenStrategy,
  ],
})
export class AuthModule {}
