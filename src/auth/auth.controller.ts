import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  signUp(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialDto);
  }

  // https://intrepidgeeks.com/tutorial/using-cookies-in-nestjs
  @Post('/logIn')
  async logIn(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const access_token = await this.authService.logIn(authCredentialDto);
    // 토큰쿠키저장
    response.cookie('Authentication', access_token, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
    });
    console.log('res', response);
    return access_token;
  }

  @Post('/logOut')
  logOut(@Req() request: Request, @Res() response: Response) {
    response.cookie('Authentication', '', {
      maxAge: 0,
    });
    return response.send({ message: '로그아웃 완료' });
  }

  @Post('/check')
  @UseGuards(AuthGuard())
  check(@Req() req) {
    //요청안에 user가 있으면 req.user로 가져올 수 있다.
    console.log('req', req.user);
  }
}
