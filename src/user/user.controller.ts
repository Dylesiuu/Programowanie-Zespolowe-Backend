import { Controller, Get, Delete, NotFoundException, Param, Patch, Body , UsePipes, ValidationPipe, ParseIntPipe, } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserService } from './user.service';
import { User } from '../auth/schemas/user.schema';
import { ApiTags, ApiBody, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { error } from 'console';

@ApiTags('UserController')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('email/:email')
  @ApiOperation({
    summary: 'Find user by email',
    description: 'This endpoint allows the user to find a user by email.',
  })
  @ApiResponse({
    status: 200,
    description: 'User found by email',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '1d12131d' },
        name: { type: 'string', example: 'Geralt' },
        lastname: { type: 'string', example: 'zRivi' },
        email: { type: 'string', example: 'Geralt@zrivii.com' },
        password: { type: 'string', example: '213jyg1h2j31j2g31kj23' },
        favourites: { type: 'array', example: [1, 2, 3] },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: [{ tagId: 1, priority: 1, name: 'friendly' }] },
      },
    },
  })
  @ApiParam({
    name: 'email',
    description: 'User email',
    type: String,
    example: 'Email@wp.pl',
  })
  @ApiResponse({
    status: 404,
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
  
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }



  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'This endpoint allows the user to get all users.',
  })
  @ApiResponse({
    status: 200,
    description: 'All users found',
    schema: {
      type: 'array',
      items: {
        properties: {
          _id: { type: 'string', example: '1d12131d' },
          name: { type: 'string', example: 'Geralt' },
          lastname: { type: 'string', example: 'zRivi' },
          email: { type: 'string', example: 'mail@gmail.com' },
          password: { type: 'string', example: '213jyg1h2j31j2g31kj23' },
          favourites: { type: 'array', example: [1, 2, 3] },
          __v: { type: 'number', example: 0 },
          traits: { type: 'array', example: [{ tagId: 1, priority: 1, name: 'friendly' }] },
        },
      },
    },
  })
  async getAllUsers(): Promise<User[]> {
    const users = this.userService.findAll();

    if (!users || (await users).length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }



  @Patch('update-name/:email')
  @ApiOperation({
    summary: 'Update user name',
    description: 'This endpoint allows the user to update the user name.',
  })
  
  @ApiParam({
    name: 'email',
    description: 'User email',
    type: String,
    example: 'email@wp.com',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Kacper' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User name updated',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '1d12131d' },
        name: { type: 'string', example: 'Geralt' },
        lastname: { type: 'string', example: 'zRivi' },
        email: { type: 'string', example: 'mail@gmail.com' },
        password: { type: 'string', example: '213jyg1h2j31j2g31kj23' },
        favourites: { type: 'array', example: [1, 2, 3] },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: [{ tagId: 1, priority: 1, name: 'friendly' }] },
      },
    },
  })
  @ApiResponse({
    status: 404,
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

  async updateUserName(@Param('email') email: string, @Body('name') name: string): Promise<User> {
    const user = this.userService.updateUserName(email, name);
    if (!user) {
      throw new NotFoundException('User not found');
    } 
    return user;
  }

  
  @ApiOperation({
    summary: 'Update user lastname',
    description: 'This endpoint allows the user to update the user lastname.',
  })
  
  @ApiParam({
    name: 'email',
    description: 'User email',
    type: String,
    example: 'email@wp.com',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Zalewski' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User lastname updated',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '1d12131d' },
        name: { type: 'string', example: 'Geralt' },
        lastname: { type: 'string', example: 'zRivi' },
        email: { type: 'string', example: 'mail@gmail.com' },
        password: { type: 'string', example: '213jyg1h2j31j2g31kj23' },
        favourites: { type: 'array', example: [1, 2, 3] },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: [{ tagId: 1, priority: 1, name: 'friendly' }] },
      },
    },
  })
  @ApiResponse({
    status: 404,
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
  @Patch('update-lastname/:email')
  async updateUserLastname(@Param('email') email: string, @Body('lastname') lastname: string): Promise<User> {
    const user = await this.userService.updateUserLastname(email, lastname);
    if (!user) {
      throw new NotFoundException('User not found');
    } 
    return user;
  }


  @Patch('update-password/:email')
  @ApiOperation({
    summary: 'Update user password',
    description: 'This endpoint allows the user to update the user password. possword validation is included.',
  })
  @ApiParam({
    name: 'email',
    description: 'User email',
    type: String,
    example: 'musk@w.com',
  })
  @ApiBody({ 
    type: UpdatePasswordDto,
    description: 'The new password to update.',
  })
  @ApiResponse({
    status: 200,
    description: 'User password updated',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password updated successfully.' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User not found' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'array', 
          items: {
            type: 'string' }, 
            example: ["Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            "Password must be at least 12 characters long." ]
          },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @UsePipes(new ValidationPipe())
  async updatePassword(@Param('email') email: string, @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    const updatedUser = await this.userService.updateUserPassword(email, updatePasswordDto);
    if (updatedUser) {
      return { message: 'Password updated successfully.' };
    } else {
      return { message: 'User not found.' };
    }
  }

  @Patch('addfavourite/:email')
  @ApiOperation({
    summary: 'Add favourite',
    description: 'This endpoint allows the user to add a favourite to the user.',
  })
  @ApiParam({
    name: 'email',
    description: 'User email',
    type: String,
    example: 'email@domain.com',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        favourites: {
          type: 'array',
          items: {
            type: 'number',
          },
          example: [1, 2, 3],
        },
      },
    },
    description: 'Array of favourite items to be added',
  })
  @ApiResponse({
    status: 200,
    description: 'Favourite added',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '1d12131d' },
        name: { type: 'string', example: 'Geralt' },
        lastname: { type: 'string', example: 'zRivi' },
        email: { type: 'string', example: 'geralt@wicher.com' },
        password: { type: 'string', example: '213jyg1h2j31j2g31kj23' },
        favourites: { type: 'array', example: [1, 2, 3] },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: [{ tagId: 1, priority: 1, name: 'friendly' }] },
      },
    },
  })
  @ApiResponse({
    status: 404,
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
  async addFavourite(@Param('email') email: string, @Body() body: { favourites: number[] },  ): Promise<User> {
    return this.userService.addFavourite(email, body.favourites);
  }

  @Delete('removefavourite/:email')
  @ApiOperation({
    summary: 'Remove favourite',
    description: 'This endpoint allows the user to remove a favourite from the user.',
  })
  @ApiParam({
    name: 'email',
    description: 'User email',
    type: String,
    example: 'example@gmail.com',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        favourites: {
          type: 'array',
          items: {
            type: 'number',
          },
          example: [1, 2, 3],
        },
      },
    },
    description: 'Array of favourites to be removed',
  })
  @ApiResponse({
    status: 200,
    description: 'Favourite removed',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '1d12131d' },
        name: { type: 'string', example: 'Geralt' },
        lastname: { type: 'string', example: 'zRivi' },
        email: { type: 'string', example: 'de@dad.pl' },
        password: { type: 'string', example: '213jyg1h2j31j2g31kj23' },
        favourites: { type: 'array', example: [1, 2, 3] },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: [{ tagId: 1, priority: 1, name: 'friendly' }] },
      },
    },
  })
  @ApiResponse({
    status: 404,
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
  async removeFavourite(@Param('email') email: string, @Body() body: { favourites: number[] }): Promise<User> {
    return this.userService.removeFavourite(email, body.favourites);
  }

  
  @Patch('addtraits/:email')
  @ApiOperation({
    summary: 'Add trait',
    description: 'This endpoint allows the user to add a trait about user.',
  })
  @ApiParam({
    name: 'email',
    description: 'User email',
    type: String,
    example: 'email@domain.de',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        trait: {
          type: 'object',
          properties: {
            tagId: { type: 'number', example: 1 },
            priority: { type: 'number', example: 1 },
            name: { type: 'string', example: 'friendly' },
          },
        },
      },
    },
    description: 'Trait to be added',
  })
  @ApiResponse({
    status: 200,
    description: 'Trait added',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '1d12131d' },
        name: { type: 'string', example: 'Geralt' },
        lastname: { type: 'string', example: 'zRivi' },
        email: { type: 'string', example: 'geralt@rivia.pl' },
        password: { type: 'string', example: '213jyg1h2j31j2g31kj23' },
        favourites: { type: 'array', example: [1, 2, 3] },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: [{ tagId: 1, priority: 1, name: 'friendly' }] },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Trait already exists',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Trait already exists' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    status: 404,
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
  async addTrait(
    @Param('email') email: string,@Body() Body: { trait: { tagId: number; priority: number; name: string } },): Promise<User> {
    return this.userService.addTrait(email, [Body.trait]);
  }



  @Delete('removetrait/:email')
  @ApiOperation({
    summary: 'Remove trait',
    description: 'This endpoint allows the user to remove a trait from the user.',
  })
  @ApiParam({
    name: 'email',
    description: 'User email',
    type: String,
    example: 'email@domain.com',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        traits: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              tagId: { type: 'number', example: 1 },
            },
          },
          example: [{ tagId: 1 }],
        },
      },
    },
    description: 'Array of traits to be removed',
  })
  @ApiResponse({
    status: 200,
    description: 'Trait removed',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '1d12131d' },
        name: { type: 'string', example: 'Anakin' },
        lastname: { type: 'string', example: 'Skywalker' },
        email: { type: 'string', example: 'lord@vader.star' },
        password: { type: 'string', example: '213jyg1h2j31j2g31kj23' },
        favourites: { type: 'array', example: [1, 2, 3] },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: [{ tagId: 1, priority: 1, name: 'Afraid of fire' }] },
      },
    },
  })
  @ApiResponse({
    status: 404,
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
    description: 'Trait does not exist',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Trait not found' },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  async removeTrait(@Param('email') email: string, @Body() body: { traits: { tagId: number }[] }): Promise<User> {
    return this.userService.removeTrait(email, body.traits);
  }

}

