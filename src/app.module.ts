import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello/hello.controller';
import { ScrollingModule } from './scrolling/scrolling.module';

@Module({
  imports: [ScrollingModule],
  controllers: [AppController, HelloController],
  providers: [AppService],
})
export class AppModule {}
