import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:name')
  getUser(@Param('name') name: string) {
    const user = this.userService.getUser(name);
    if (!user) {
      throw new NotFoundException('Not Found');
    }

    return user;
  }
}
