import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

const TENANT_HEADER = 'x-tenant-id';

@Injectable()
export class tenancyMiddleware implements NestMiddleware {
  constructor() {}
  public async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const header = req.headers[TENANT_HEADER] as string;
    // if (!header) {
    //   throw new BadRequestException('Please provide API KEY or SLUG');
    // }

    // const condition = {};
    // if (
    //   [
    //     '/auth/login',
    //     '/auth/social_login',
    //     '/auth/forget_password',
    //     '/auth/reset_password',
    //   ].includes(req.url)
    // ) {
    //   condition['slug'] = header;
    // } else {
    //   condition['api_key'] = header;
    // }
    // const query = [{ slug: header.toLowerCase() }, { api_key: header }];
    // const account = await this.adminaccountservice.findOne(query);

    // if (!account) {
    //   throw new BadRequestException('Invalid Account');
    // }

    // if (account.status != 'ACTIVE') {
    //   throw new BadRequestException('Account Not active');
    // }

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
