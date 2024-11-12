import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { AdminAccountService } from '../admin/admin-accounts/admin-account.service';

const TENANT_HEADER = 'x-tenant-id';

@Injectable()
export class tenancyMiddleware implements NestMiddleware {
  constructor(private readonly adminaccountservice: AdminAccountService) {}
  public async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const header = req.headers[TENANT_HEADER] as string;

    if (!header) {
      throw new BadRequestException('Please provide API KEY or SLUG');
    }

    const query = [{ slug: header.toLowerCase() }];
    const account = await this.adminaccountservice.findOne(query);

    if (!account) {
      throw new BadRequestException('Invalid Account');
    }

    if (account.status != 'ACTIVE') {
      throw new BadRequestException('Account Not active');
    }

    req['tenantId'] = `tenent_${account.id}`;

    next();
  }
}

@Injectable()
export class tenancyMiddlewareAdmin implements NestMiddleware {
  constructor() {}

  public async use(req: any, res: any, next: NextFunction): Promise<void> {
    const header = req.headers[TENANT_HEADER] as string;
    if (header) {
      req.tenantId = header;
    }
    next();
  }
}
