import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenencyModule } from 'src/modules/tenency/tenency.module';
import { DepartmentModule } from 'src/modules/tenented/department/department.module';
import { UserModule } from 'src/modules/tenented/user/user.module';
import * as ormconfig from 'src/orm_configs/orm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminAccountModule } from './modules/admin/admin-accounts/admin-account.module';
import { AuthModule } from './modules/tenented/auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TenencyModule,
    DepartmentModule,
    UserModule,
    AuthModule,
    AdminAccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
