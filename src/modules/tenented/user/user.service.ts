import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CONNECTION } from 'src/modules/tenency/tenency.symbol';
import { User } from './user.entity';
import { Account } from '../account/account.entity';

@Injectable()
export class UserService {
  private readonly usermodel: Repository<User>;
  private readonly connection: DataSource;
  constructor(@Inject(CONNECTION) connection: DataSource) {
    this.usermodel = connection.getRepository(User);
    this.connection = connection;
  }

  async findOne(params: any, select = null) {
    const query = {
      where: params,
    };
    if (select) {
      query['select'] = select;
    }
    return await this.usermodel.findOne(query);
  }

  async update(userid: string, updatePayload: any) {
    return await this.usermodel.update({ id: userid }, updatePayload);
  }

  async getOneAccount() {
    const account = await this.connection.getRepository(Account).find();
    return account[0];
  }

  async logout(userid: string) {
    return await this.usermodel.update({ id: userid }, { refresh_token: null });
  }
}
