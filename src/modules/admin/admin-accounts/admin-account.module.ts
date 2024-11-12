import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAccountService } from './admin-account.service';
import { MasterAccount } from './masteraccount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MasterAccount])],
  providers: [AdminAccountService],
  exports: [AdminAccountService],
})
export class AdminAccountModule {}
