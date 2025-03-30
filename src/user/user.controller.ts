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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/roles/user-role.enum';
import { ApiRoles } from 'src/decorators/api-roles.decorator';
import { ApiNotFoundResponse, ApiResponse } from '@nestjs/swagger';

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

  @Roles(UserRole.ADMIN)
  @Patch('update-role/:id')
  @ApiRoles(UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User role updated successfully' },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
    content: {
      'application/json': {
        examples: {
          invalidId: {
            summary: 'Invalid user ID',
            value: {
              message: 'Invalid user ID',
              statusCode: 400,
            },
          },
          invalidRole: {
            summary: 'Invalid role',
            value: {
              message: 'Invalid role',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    if (!ObjectId.isValid(id)) {
      return { message: 'Invalid user ID', statusCode: 400 };
    }
    const res = await this.userService.updateUserRole(new ObjectId(id), role);
    if (res.message === 'Invalid role') {
      return { message: res.message, statusCode: 400 };
    }
    if (res.message === 'User not found') {
      throw new NotFoundException('User not found');
    }

    if (res.message === 'User role updated successfully') {
      return { message: 'User role updated successfully', statusCode: 200 };
    }

    return { message: 'User role update failed', statusCode: 500 };
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
