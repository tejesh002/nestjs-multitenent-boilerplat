import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterAccount } from './masteraccount.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminAccountService {
  constructor(
    @InjectRepository(MasterAccount)
    private readonly adminAccountModel: Repository<MasterAccount>,
  ) {}

  async findOne(param: any) {
    return await this.adminAccountModel.findOne({ where: param });
  }
}
