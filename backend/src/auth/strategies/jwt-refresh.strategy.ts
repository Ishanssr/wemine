import { Injectable, Optional } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(@Optional() config?: ConfigService) {
    const secretOrKey = config?.get('JWT_REFRESH_SECRET') || 'dev-jwt-refresh-secret-change-in-production';
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    return payload;
  }
}
