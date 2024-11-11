import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/modules/tenented/auth/auth.service';

@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('ADMIN') {}

@Injectable()
export class JwtAdminRefreshAuthGuard extends AuthGuard('ADMIN-REFRESH') {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('JWT') {
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest();

    const user = await this.authService.findOne({ id: request.user.sub });
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.status != 'ACTIVE') {
      throw new BadRequestException('InActive User');
    }
    delete user.refresh_token;
    user['is_guest'] = false;
    request.user = user;
    return true;
  }
}

@Injectable()
export class JwtAuthRefreshGuard extends AuthGuard('JWT-REFRESH') {}
