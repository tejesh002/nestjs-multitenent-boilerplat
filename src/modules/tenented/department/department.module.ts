import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deparment } from './department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deparment])],
  providers: [],
})
export class DepartmentModule {}
