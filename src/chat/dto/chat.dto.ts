import { User } from 'src/auth/dto/user.dto';

export class Chat {
  chatIdx: number;
  roomIdx: number;
  userIdx: number;
  text: string;
  isMine: boolean;
  createAt: Date;
  user?: User;
  page: number;
}
