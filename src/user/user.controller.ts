import { Controller, Get, NotFoundException, Param, Patch, Body  } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../auth/schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Patch('update-name/:email')
  async updateUserName(@Param('email') email: string, @Body('name') name: string): Promise<User> {
    return this.userService.updateUserName(email, name);
  }

  @Patch('update-lastname/:email')
  async updateUserLastname(@Param('email') email: string, @Body('lastname') lastname: string): Promise<User> {
    return this.userService.updateUserLastname(email, lastname);
  }

  @Patch('update-password/:email')
  async updateUserPassword(@Param('email') email: string, @Body('password') password: string): Promise<User> {
    return this.userService.updateUserPassword(email, password);
  }


  @Patch('add-favourite/:email/:favouriteId')
  async addFavourite(@Param('email') email: string, @Param('favouriteId') favouriteId: number): Promise<User> {
    const user = await this.userService.addFavourite(email, favouriteId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch('remove-favourite/:email/:favouriteId')
  async removeFavourite(@Param('email') email: string, @Param('favouriteId') favouriteId: number): Promise<User> {
    const user = await this.userService.removeFavourite(email, favouriteId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

}

