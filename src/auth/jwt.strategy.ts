import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import { JwtConstants } from './constants';
const prisma = new PrismaClient();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: JwtConstants.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Request에서 JWT를 추출하는 방법 중 Bearer Token 사용
      ignoreExpiration: false, // jwt 보증을 passport 모듈에 위임함. 만료된 JWT인경우 request거부, 401 response
    });
  }

  async validate(payload) {
    const { id } = payload;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
