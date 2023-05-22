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

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  async signUp(
    // Dto에 있는 유효성 조건에 맞게 체크를 해주려면 ValidationPipe 필요
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
      httpOnly: false,
      // httpOnly: true,
    });

    return access_token;
  }

  @Post('/logOut')
  async logOut(@Req() request: Request, @Res() response: Response) {
    response.cookie('Authentication', '', {
      maxAge: 0,
    });
    return response.send({ message: '로그아웃 완료' });
  }

  @Post('/modify')
  async modify(@Body() authCredentialDto: AuthCredentialDto) {
    this.authService.modifyUser(authCredentialDto);
  }

  @Post('/isDuplicate')
  async isDuplicate(@Body() authCredentialDto: AuthCredentialDto) {
    return this.authService.isDuplicate(authCredentialDto);
  }

  // @Post('/getCookies')
  // getCookie(@Req() request) {
  //   const cookies = request.cookies;
  //   const auth = cookies.Authentication;
  //   console.log(auth);
  //   return auth;
  // }

  /**
   * UseGuards안에 @nestjs/passport에서 가져온 AuthGuard()를
   * 이용하면 요청안에 유저 정보를 넣어줄수있습니다.
   */
  @Post('/check')
  @UseGuards(AuthGuard())
  async check(@Req() req) {
    //요청안에 user가 있으면 req.user로 가져올 수 있다.
    return req.user;
  }
}
