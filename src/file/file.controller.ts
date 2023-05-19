import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { multerOptions } from 'src/util/multerOptions';
import { User } from 'src/auth/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Controller('upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FilesInterceptor('profileImg', 1, multerOptions))
  // FilesInterceptor 첫번째 매개변수: formData의 key값,
  // 두번째 매개변수: 파일 최대 갯수
  // 세번째 매개변수: 파일 설정 (위에서 작성했던 multer 옵션들)
  @Post('/myPage')
  async test(@Body() formData: User, @Req() request) {
    const files = request.files; // 업로드된 파일들이 위치하는 곳

    formData.password = await this.hashPwd(formData.password);

    if (files && files.length > 0) {
      const uploadedPath = this.fileService.uploadFiles(files);
      formData.profileImg = uploadedPath[0];
    } else {
      if (formData.originalName) {
        formData.profileImg = formData.originalName;
      }
    }

    console.log('formData', formData.id);
    console.log('formData', formData.password);
    console.log('formData', formData.name);
    console.log('formData', formData.originalName);
    console.log('formData', formData.profileImg);

    const changeMyPage = this.fileService.changeMyInfo(formData);
    return changeMyPage;
  }

  async hashPwd(data: string) {
    const salt = await bcrypt.genSalt();
    const hashPwd = await bcrypt.hash(data, salt);
    return hashPwd;
  }
}
