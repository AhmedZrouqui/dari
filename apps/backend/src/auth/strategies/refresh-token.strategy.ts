import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import cookieExtractor from './cookieExtractor';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) {
      throw new Error(
        'JWT_REFRESH_SECRET is not defined in the environment variables',
      );
    }
    super({
      jwtFromRequest: (req: Request) => cookieExtractor(req, 'refresh-token'),
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = cookieExtractor(req, 'refresh-token');
    // Attach both the payload and the token itself to the request object
    return { ...payload, refreshToken };
  }
}
