import { BadRequestException, Injectable } from '@nestjs/common';
import { MasterAccount } from 'src/modules/admin/admin-accounts/masteraccount.entity';
import { AppDataSource } from 'src/orm_configs/public_datasource';
import { SignUpDTO } from './auth.dto';
import { getTenantConnection } from 'src/modules/tenency/tenency.utils';
import * as bcrypt from 'bcryptjs';
import { Account } from '../account/account.entity';
import { User } from '../user/user.entity';

@Injectable()
export class UnAuthService {
  constructor() {}

  async signUp(payload: SignUpDTO) {
    const querymanager = await AppDataSource.initialize();
    const masterQueryrunner = await querymanager.createQueryRunner();
    let schemaName;
    let error = false;
    let message = 'Error Occur While Create Account';
    await masterQueryrunner.connect();
    await masterQueryrunner.startTransaction();
    try {
      const accountcheck = await masterQueryrunner.manager
        .getRepository(MasterAccount)
        .findOne({
          where: {
            slug: payload.slug,
          },
        });

      if (accountcheck) {
        throw new BadRequestException('Account Already Exists');
      }
      let account = new MasterAccount();
      account.name = payload.account_name;
      account.slug = payload.slug;
      account.status = 'ACTIVE';

      account = await masterQueryrunner.manager.save(account);
      schemaName = `tenent_${account.id}`;

      await querymanager.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

      const connection = await getTenantConnection(`${schemaName}`);
      await connection.runMigrations();

      const tenentqueryrunner = connection.createQueryRunner();

      await tenentqueryrunner.connect();
      await tenentqueryrunner.startTransaction();

      try {
        const accountinfo = {
          name: payload.account_name,
          slug: payload.slug,
        };

        await tenentqueryrunner.manager
          .getRepository(Account)
          .save(Object.assign(new Account(), accountinfo));

        const userinfo = {
          email: payload.email,
          name: payload.name,
          phone_number: payload.phone_number,
          password: payload.password,
          status: 'ACTIVE',
        };

        // console.info(
        //   await connection
        //     .createQueryBuilder(tenentqueryrunner)
        //     .insert()
        //     .into('user')
        //     .values(userinfo),
        // );

        await tenentqueryrunner.manager
          .getRepository(User)
          .save(Object.assign(new User(), userinfo));

        await masterQueryrunner.commitTransaction();
        await tenentqueryrunner.commitTransaction();
      } catch (err) {
        await masterQueryrunner.rollbackTransaction();
        await tenentqueryrunner.rollbackTransaction();

        await querymanager.query(
          `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`,
        );
        error = true;
        message = err?.message || err;
      } finally {
        await masterQueryrunner.release();
        await tenentqueryrunner.release();
        await connection.destroy();
      }
    } catch (err) {
      await masterQueryrunner.rollbackTransaction();
      if (err.code === '23505') {
        if (new String(err.detail).startsWith('Key (name)')) {
          throw new BadRequestException('Organization name already exists.');
        }
        throw new BadRequestException('Email already exists.');
      }
      await querymanager.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
      throw new BadRequestException(err?.message || err);
    } finally {
      await masterQueryrunner.release();
      await querymanager.destroy();
    }
    if (error) {
      throw new BadRequestException(message);
    }
    return {
      success: true,
      message: 'Account created successfully',
    };
  }
}
