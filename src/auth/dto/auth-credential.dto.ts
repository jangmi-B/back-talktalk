import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  isString,
} from 'class-validator';
// 유효성 체크를 하기 위해서는 class-validator 모듈을 사용

export class AuthCredentialDto {
  userIdx: number;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  id: string;

  password: string;
  name: string;
  profileImg: string;
  isDelete: string;
  createAt: Date;
}
