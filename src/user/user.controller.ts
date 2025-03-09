import { Controller, Get, NotFoundException, Param, Patch, Body , UsePipes, ValidationPipe } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto';
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
  @UsePipes(new ValidationPipe())
  async updatePassword(
    @Param('email') email: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    const updatedUser = await this.userService.updateUserPassword(email, updatePasswordDto);
    if (updatedUser) {
      return { message: 'Password updated successfully.' };
    } else {
      return { message: 'User not found.' };
    }
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

