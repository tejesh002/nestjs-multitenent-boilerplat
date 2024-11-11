import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Deparment } from './department.entity';
import { CONNECTION } from 'src/modules/tenency/tenency.symbol';

@Injectable()
export class DepartmentService {
  private readonly departmentModel: Repository<Deparment>;
  private readonly connection: DataSource;
  constructor(@Inject(CONNECTION) connection: DataSource) {
    this.departmentModel = connection.getRepository(Deparment);
    this.connection = connection;
  }
}
