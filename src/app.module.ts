import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello/hello.controller';
import { UserModule } from './user/user.module';
import { ScrollingModule } from './scrolling/scrolling.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule,ScrollingModule, AuthModule],
  controllers: [AppController, HelloController],
  providers: [AppService],
})
export class AppModule {}
