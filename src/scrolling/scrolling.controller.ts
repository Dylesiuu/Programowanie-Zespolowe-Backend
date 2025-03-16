import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ScrollingService } from './scrolling.service';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

@Controller('scrolling')
export class ScrollingController {
  private scrollingService;

  constructor(scrollingService: ScrollingService) {
    this.scrollingService = scrollingService;
  }

  @Get(':arg')
  getData(@Param('arg') arg: string) {
    const isObjectId = (value: string): boolean => {
      return mongoose.isValidObjectId(value);
    };
    if (isObjectId(arg)) {
      return this.scrollingService.getPetbyIndex(arg);
    } else {
      return this.scrollingService.getPetbyName(arg);
    }
  }

  @Get('')
  gatAllPet() {
    return this.scrollingService.getAll();
  }

  @Post('match')
  async match(
    @Body('userId') userId: string,
    @Body('lng') lng: number,
    @Body('lat') lat: number,
  ) {
    const result = this.scrollingService.match(new ObjectId(userId));

    if (result.message === 'User not found.') {
      throw new Error('User not found.');
    }

    if (result.message === 'No pets found.') {
      return { message: 'No pets found.' };
    }

    return result;
  }
}
