import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  isString,
} from 'class-validator';

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
