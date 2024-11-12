import { Module, Scope } from '@nestjs/common';
import { AuthController, UnAuthController } from './auth.controller';
import { UnAuthService } from './unauth.service';
import { REQUEST } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
import { getTenantConnection } from 'src/modules/tenency/tenency.utils';
import { UserModule } from 'src/modules/tenented/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtAccessRefreshTokenStrategy, JwtAccessTokenStrategy } from 'src/jwt/jwt-strategy';

const connectionFactory = {
  provide: 'CONNECTION',
  scope: Scope.REQUEST,
  useFactory: (request: ExpressRequest) => {
    const { tenantId }: any = request;

    if (tenantId) {
      return getTenantConnection(tenantId);
    }

    return null;
  },
  inject: [REQUEST],
};

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [UnAuthController, AuthController],
  providers: [
    UnAuthService,
    AuthService,
    connectionFactory,
    JwtAccessTokenStrategy,
    JwtAccessRefreshTokenStrategy,
  ],
})
export class AuthModule {}
