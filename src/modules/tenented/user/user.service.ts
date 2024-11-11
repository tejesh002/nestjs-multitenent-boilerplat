import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CONNECTION } from 'src/modules/tenency/tenency.symbol';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private readonly usermodel: Repository<User>;
  private readonly connection: DataSource;
  constructor(@Inject(CONNECTION) connection: DataSource) {
    this.usermodel = connection.getRepository(User);
    this.connection = connection;
  }
}
