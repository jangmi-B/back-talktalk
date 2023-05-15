import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, FileModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
