import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { multerOptions } from 'src/util/multerOptions';

@Controller('upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FilesInterceptor('profile', 1, multerOptions))
  // FilesInterceptor 첫번째 매개변수: formData의 key값,
  // 두번째 매개변수: 파일 최대 갯수
  // 세번째 매개변수: 파일 설정 (위에서 작성했던 multer 옵션들)
  @Post('/profile')
  public uploadFiles(@UploadedFiles() files: File[]) {
    console.log('files', files);
    const uploadedFiles: string[] = this.fileService.uploadFiles(files);

    return {
      status: 200,
      message: '파일 업로드를 성공하였습니다.',
      data: {
        files: uploadedFiles,
      },
    };
  }
}
