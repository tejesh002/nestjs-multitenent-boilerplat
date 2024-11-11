import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'src/config';

type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class JwtAdminRefreshStrategy extends PassportStrategy(
  Strategy,
  'ADMIN-REFRESH',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.jwt_refresh_admin,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'JWT') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.jwt_secret,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}

@Injectable()
export class JwtAccessRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'JWT-REFRESH',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.jwt_refresh_secret,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
