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
    const salt = await bcrypt.genSalt();
    const hashPwd = await bcrypt.hash(password, salt);

    try {
      console.log(authCredentialDto);
      const user = await prisma.user.create({
        data: { id, password: hashPwd, name },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('이미 존재하는 아이디입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

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
      console.log(user);

      // 유저 토큰 생성(secret + payload)
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
}
