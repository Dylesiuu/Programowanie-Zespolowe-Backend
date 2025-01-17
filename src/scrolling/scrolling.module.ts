import { Module } from '@nestjs/common';
import { ScrollingService } from './scrolling.service';
import { ScrollingController } from './scrolling.controller';

@Module({
  controllers: [ScrollingController],
  providers: [ScrollingService],
})
export class ScrollingModule {}
