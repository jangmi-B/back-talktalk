import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// https://velog.io/@yiyb0603/Nest.js%EC%97%90%EC%84%9C-%ED%8C%8C%EC%9D%BC-%EC%97%85%EB%A1%9C%EB%93%9C%ED%95%98%EA%B8%B0
export const multerOptions = {
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      // 이미지 형식은 jpg, jpeg, png만 허용합니다.
      callback(null, true);
    } else {
      callback(new Error('지원하지 않는 이미지 형식입니다.'), false);
    }
  },

  storage: diskStorage({
    destination: (request, file, callback) => {
      // 저장경로 설정
      // https://songhee96.tistory.com/27
      const uploadPath: string =
        '/Users/baegseunghyeon/Documents/front-chatapp/public/images/upload';

      if (!existsSync(uploadPath)) {
        // public 폴더가 존재하지 않을시, 생성합니다.
        mkdirSync(uploadPath);
      }

      callback(null, uploadPath);
    },

    filename: (request, file, callback) => {
      callback(null, uuidRandom(file));
    },
  }),
};

export const createImageURL = (file): string => {
  const serverAddress: string = 'http://localhost:3000';

  // 파일이 저장되는 경로: 서버주소/public 폴더
  // 위의 조건에 따라 파일의 경로를 생성해줍니다.
  // http://localhost:8080/public/파일이름 형식으로 저장이 됩니다.
  // return `${serverAddress}/images/upload/${file.filename}`;
  return `/images/upload/${file.filename}`;
};

export const uuidRandom = (file): string => {
  const uuidPath: string = `${uuidv4()}${extname(file.originalname)}`;
  return uuidPath;
};
