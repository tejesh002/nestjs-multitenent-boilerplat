import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
import { getTenantConnection } from 'src/modules/tenency/tenency.utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

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
  imports: [TypeOrmModule.forFeature([User])],
  providers: [connectionFactory, UserService],
  exports: [UserService],
})
export class UserModule {}
