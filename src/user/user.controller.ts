import { Controller, Get, Delete, NotFoundException, Param, Patch, Body , UsePipes, ValidationPipe, ParseIntPipe, } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { ApiTags, ApiBody, ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Schema as MongooseSchema } from 'mongoose';
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
        favourites: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"] },
        role: { type: 'string', example: 'USER' },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6"] },
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
      type: 'object',
        properties: {
          _id: { type: 'string', example: '1d12131d' },
          name: { type: 'string', example: 'Geralt' },
          lastname: { type: 'string', example: 'zRivi' },
          email: { type: 'string', example: 'mail@gmail.com' },
          password: { type: 'string', example: '213jyg1h2j31j2g31kj23' },
          favourites: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"] },
          role: { type: 'string', example: 'USER' },
          __v: { type: 'number', example: 0 },
          traits: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6"] },
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
        _id: { type: 'string', example: '213jyg1h2j31j2g31kj23' },
        name: { type: 'string', example: 'Geralt' },
        lastname: { type: 'string', example: 'zRivi' },
        email: { type: 'string', example: 'mail@gmail.com' },
        password: { type: 'string', example: '213jyg1h2j31j2g31kj23' },
        favourites: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"] },
        role: { type: 'string', example: 'USER' },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6"] },
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
        favourites: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"] },
        role: { type: 'string', example: 'USER' },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6"] },
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
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
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
            type: 'ObjectId',
          },
          example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"],
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
        favourites: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"] },
        role: { type: 'string', example: 'USER' },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6"] },
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
  async addFavourite(@Param('email') email: string, @Body() body: { favourites: MongooseSchema.Types.ObjectId[] },  ): Promise<User> {
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
            type: 'ObjectId',
          },
          example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"],
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
        favourites: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"] },
        role: { type: 'string', example: 'USER' },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6"] },
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
  async removeFavourite(@Param('email') email: string, @Body() body: { favourites: MongooseSchema.Types.ObjectId[] }): Promise<User> {
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
              type: 'array',
              items: {
                type: 'ObjectId',
              },
              example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"],
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
        favourites: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"] },
        role: { type: 'string', example: 'USER' },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6"] },
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
    @Param('email') email: string,@Body() Body: { trait: MongooseSchema.Types.ObjectId[] },): Promise<User> {
    return this.userService.addTrait(email, Body.trait);
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
        trait: {
          type: 'array',
          items: {
            type: 'ObjectId',
          },
          example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"],
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
        favourites: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6", "65f8d3a7b9c1d2e0f6a4b5c7", "65f8d3a7b9c1d2e0f6a4b7c6"] },
        role: { type: 'string', example: 'USER' },
        __v: { type: 'number', example: 0 },
        traits: { type: 'array', example: ["65f8d3a7b9c1d2e0f6a4b5c6"] },
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
  async removeTrait(@Param('email') email: string, @Body() body: { trait: MongooseSchema.Types.ObjectId[] }): Promise<User> {
    return this.userService.removeTrait(email, body.trait);
  }

}

