import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello/hello.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController, HelloController],
  providers: [AppService],
})
export class AppModule {}
