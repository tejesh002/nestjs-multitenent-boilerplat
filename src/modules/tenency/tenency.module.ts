import { Global, MiddlewareConsumer, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
import { tenancyMiddleware } from './tenency.middleware';
import { CONNECTION } from './tenency.symbol';
import { getTenantConnection } from './tenency.utils';
import { DepartmentModule } from 'src/modules/tenented/department/department.module';
import { UserModule } from 'src/modules/tenented/user/user.module';
import { AuthModule } from 'src/modules/tenented/auth/auth.module';
import { AdminAccountModule } from 'src/modules/admin/admin-accounts/admin-account.module';

const connectionFactory = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  useFactory: async (request: ExpressRequest) => {
    const { tenantId }: any = request;
    if (tenantId) {
      return await getTenantConnection(tenantId);
    }
    return null;
  },
  inject: [REQUEST],
};

@Global()
@Module({
  imports: [DepartmentModule, UserModule, AuthModule, AdminAccountModule],
  providers: [connectionFactory],
  exports: [CONNECTION],
})
export class TenencyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(tenancyMiddleware).forRoutes('/v1');
  }
}
