import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { env } from 'src/config';
import { UserService } from 'src/modules/tenented/user/user.service';
import { comparePassword } from 'src/utils';
import { SignInDTO } from './auth.dto';
@Injectable()
export class AuthService {
  constructor(
    public jwtService: JwtService,
    private readonly userservice: UserService,
  ) {}

  async findOne(param: any) {
    return this.userservice.findOne(param);
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          is_guest: false,
        },
        {
          secret: env.jwt_secret,
          expiresIn: env.jwt_token_expires,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: env.jwt_refresh_secret,
          expiresIn: env.jwt_refresh_expires,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn(body: SignInDTO) {
    try {
      const user = await this.userservice.findOne({ email: body.email }, [
        'id',
        'email',
        'password',
        'status',
      ]);

      console.info('=============');
      console.info(JSON.stringify(user));
      console.info('=============');

      if (!user) throw new BadRequestException('Invalid Email');

      const areEqual = await comparePassword(user.password, body.password);

      if (!areEqual) throw new BadRequestException('Invalid Password');

      if (user.status != 'ACTIVE') {
        throw new BadRequestException('User Not Active');
      }

      const tokens = await this.getTokens(user.id, user.id);
      await this.userservice.update(user.id, {
        refresh_token: await this.hashData(tokens.refreshToken),
      });

      return tokens;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const user = await this.userservice.findOne({ id: userId }, [
        'id',
        'refresh_token',
      ]);

      if (!user || !user.refresh_token) throw new UnauthorizedException();

      const refreshTokenMatches = await argon2.verify(
        user.refresh_token,
        refreshToken,
      );

      if (!refreshTokenMatches) throw new UnauthorizedException();
      const tokens = await this.getTokens(user.id, user.id);
      await this.userservice.update(user.id, {
        refresh_token: await this.hashData(tokens.refreshToken),
      });

      return {
        ...tokens,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async logout(userId: string) {
    return this.userservice.logout(userId);
  }
}
