import { Module, Scope } from '@nestjs/common';
import { UnAuthController } from './auth.controller';
import { UnAuthService } from './unauth.service';
import { REQUEST } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
import { getTenantConnection } from 'src/modules/tenency/tenency.utils';

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
  controllers: [UnAuthController],
  providers: [UnAuthService, connectionFactory],
})
export class AuthModule {}
