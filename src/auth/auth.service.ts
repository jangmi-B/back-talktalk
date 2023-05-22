import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { id, password, name } = authCredentialDto;
    // bcrypt : 솔트(salt) + 비밀번호(Plain Password)를 해시Hash로 암호화 해서 저장
    const salt = await bcrypt.genSalt();
    const hashPwd = await bcrypt.hash(password, salt);

    try {
      const user = await prisma.user.create({
        data: { id, password: hashPwd, name },
      });
    } catch (error) {
      // 존재하는 아이디가 입력됐을 때 에러코드
      if (error.code === 'P2002') {
        throw new ConflictException('이미 존재하는 아이디입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // 아이디 중복 확인
  async isDuplicate(authCredentialDto: AuthCredentialDto): Promise<boolean> {
    let result = false;
    const isExist = await prisma.user.findUnique({
      where: {
        id: authCredentialDto.id,
      },
    });
    if (isExist !== null) {
      result = true;
    }
    return result;
  }

  /**
   * JWT (JSON Web Token)
   * 당사자간에 정보를 JSON 개체로 안 전하게 전송하기위한 컴팩트하고 독립적인 방식을 정의하는 표준
   * Header + Payload + Signiture
   *
   * Passport 모듈(https://chanyeong.com/blog/post/28)
   * 그리고 토큰이 유효한 토큰인지 서버에서 secret text를 이용해서 알아내면
   * ayload 안에 유저 이름을 이용해서 데이터베이스 안에 있는 유저이름에 해당하는 유저 정보를 모두 가져올수 있습니다.
   * 이러한 처리를 쉽게 해주는게 Passport 모듈 입니다.
   */
  async logIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { id, password } = authCredentialDto;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      /*
        유저 토큰 생성(secret + payload)
        - Token을 만드려면 Secret과 Payload가 필요.
        Payload에는 자신이 전달하고자 하는 정보를 넣어주면된다. 
        Role정보든, 유저 이름이든, 이메일이든 하지만 중요정보나 민감정보는 안된다.
      */
      const payload = { id };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken: accessToken };
    } else {
      throw new UnauthorizedException('로그인 실패!!!');
    }
  }

  async modifyUser(authCredentialDto: AuthCredentialDto): Promise<boolean> {
    const result = false;
    const salt = await bcrypt.genSalt();
    const hashPwd = await bcrypt.hash(authCredentialDto.password, salt);

    console.log('들어옴');
    console.log(authCredentialDto);

    const changeUser = await prisma.user.update({
      where: { userIdx: authCredentialDto.userIdx },
      data: {
        name: authCredentialDto.name,
        password: hashPwd,
      },
    });

    return result;
  }
}
