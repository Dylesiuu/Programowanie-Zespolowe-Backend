import {
  Controller,
  Get,
  Delete,
  NotFoundException,
  Param,
  Patch,
  Body,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserService } from './user.service';
import { User } from '../user/schemas/user.schema';
import { ObjectId } from 'mongodb';

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
    const users = this.userService.findAll();

    if (!users || (await users).length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  @Patch('update-name/:email')
  async updateUserName(
    @Param('email') email: string,
    @Body('name') name: string,
  ): Promise<User> {
    const user = this.userService.updateUserName(email, name);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch('update-lastname/:email')
  async updateUserLastname(
    @Param('email') email: string,
    @Body('lastname') lastname: string,
  ): Promise<User> {
    const user = await this.userService.updateUserLastname(email, lastname);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch('update-password/:email')
  @UsePipes(new ValidationPipe())
  async updatePassword(
    @Param('email') email: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const updatedUser = await this.userService.updateUserPassword(
      email,
      updatePasswordDto,
    );
    if (updatedUser) {
      return { message: 'Password updated successfully.' };
    } else {
      return { message: 'User not found.' };
    }
  }

  //Fix later, commented out due to bugs
  /*
  @Patch(':email/traits')
  async addTrait(
    @Param('email') email: string,
    @Body() traitId: string,
  ): Promise<User> {
    return this.userService.addTrait(email, new ObjectId(traitId));
  }

  @Delete(':email/traits')
  async removeTrait(
    @Param('email') email: string,
    @Body() traitId: string,
  ): Promise<User> {
    return this.userService.removeTrait(email, new ObjectId(traitId));
  }
  */
}
