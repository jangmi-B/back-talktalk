import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { User } from 'src/auth/dto/user.dto';
import { createImageURL } from 'src/util/multerOptions';

const prisma = new PrismaClient();

@Injectable()
export class FileService {
  public uploadFiles(files: File[]): string[] {
    const generatedFiles: string[] = [];

    for (const file of files) {
      // 업로드 경로 반환
      generatedFiles.push(createImageURL(file));
    }

    return generatedFiles;
  }

  async changeMyInfo(user: User) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name,
          password: user.password,
          originalName: user.originalName ? user.originalName : '',
          profileImg: user.profileImg ? user.profileImg : '',
        },
      });
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update user.');
    }
  }
}
