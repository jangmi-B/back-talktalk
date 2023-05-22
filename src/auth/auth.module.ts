import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtConstants } from './constants';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // 토큰을 만들 때 이용하는 Secret 텍스트
      secret: JwtConstants.secret,
      // 유효시간
      signOptions: {
        expiresIn: 12 * 60 * 60,
      },
    }),
  ],
  controllers: [AuthController],
  // JwtStrategy를 AuthModule에서 사용할 수 있게 등록
  providers: [AuthService, JwtStrategy],
  // JwtStrategy, PassportModule를 다른 모듈에서 사용할 수 있게 등록
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
