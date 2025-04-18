import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Headers,
} from '@nestjs/common';
import { ScrollingService } from './scrolling.service';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/roles/user-role.enum';
import { ApiRoles } from 'src/decorators/api-roles.decorator';
import { TokenService } from 'src/auth/token.service';

@ApiTags('ScrollingController')
@Controller('scrolling')
export class ScrollingController {
  private scrollingService;

  constructor(
    scrollingService: ScrollingService,
    private readonly tokenService: TokenService,
  ) {
    this.scrollingService = scrollingService;
  }

  @Roles(UserRole.USER)
  @Get(':arg')
  @ApiRoles(UserRole.USER)
  @ApiOperation({
    description:
      'This endpoint allows you to retrieve data about a specific pet. ' +
      'You can search for a pet by providing either the pet ID or the pet name. ' +
      'If the pet is found, the endpoint will return the pet. ' +
      'information, otherwise it will return an error message.',
    summary: 'Return an pet by id or name',
  })
  @ApiResponse({
    status: 200,
    description: 'Pet found.',
    schema: {
      type: 'object',
      properties: {
        result: {
          type: 'Animal',
          example: {
            _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
            name: 'Pomelo',
            birthYear: 2022,
            birthMonth: 6,
            description: 'pochodzi z torunia',
            gender: 'Suka',
            type: true,
            shelter: new ObjectId('60af8845e13b1c002b1a1b46'),
            traits: [new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8')],
            images: [
              'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
            ],
            age: '3 years',
          },
        },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No pet found.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Pet not found.' },
        error: {
          type: 'string',
          example: 'Not Found',
        },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
    content: {
      'application/json': {
        examples: {
          nameTooLong: {
            summary: 'Name is too long.',
            value: {
              message: 'Name is too long.',
              statusCode: 400,
            },
          },
          incorrectName: {
            summary: 'Incorrect name',
            value: {
              message: 'Name can only contain letters, numbers, and spaces.',
              statusCode: 400,
            },
          },
          invalidName: {
            summary: 'Invalid input.',
            value: {
              message: 'Invalid input.',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  async getData(@Param('arg') arg: string) {
    const isObjectId = (value: string): boolean => {
      return mongoose.isValidObjectId(value);
    };

    let result;
    if (isObjectId(arg)) {
      result = await this.scrollingService.getPetbyIndex(arg);
    } else {
      result = await this.scrollingService.getPetbyName(arg);
    }

    if (result.message === 'Pet not found.') {
      throw new NotFoundException('Pet not found.');
    }

    if ('message' in result) {
      return { message: result.message, statusCode: 400 };
    }

    return { result, statusCode: 200 };
  }

  @Roles(UserRole.ADMIN)
  @Get('')
  @ApiRoles(UserRole.ADMIN)
  @ApiOperation({
    description:
      'This endpoint allows you to retrieve data about all pets. ' +
      'If there are pets in the database, the endpoint will return an array of pets. ' +
      'If there are no pets in the database, the endpoint will return an empty array.',
    summary: 'Return all pets',
  })
  @ApiResponse({
    status: 200,
    description: 'Pets found.',
    schema: {
      properties: {
        Animals: {
          type: 'array',
          items: {
            type: 'object',
          },
          example: [
            {
              _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
              name: 'Pomelo',
              birthYear: 2022,
              birthMonth: 6,
              description: 'pochodzi z torunia',
              gender: 'Suka',
              type: true,
              shelter: new ObjectId('60af8845e13b1c002b1a1b46'),
              traits: [new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8')],
              images: [
                'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
              ],
              age: '3 years',
            },
            {
              _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7b9'),
              name: 'Spongebob',
              birthYear: 2020,
              birthMonth: 3,
              description: 'pochodzi z bydgoszczy',
              gender: 'Pies',
              type: false,
              shelter: new ObjectId('60af8845e13b1c002b1a1b47'),
              traits: [
                new ObjectId('507f1f77bcf86cd799439011'),
                new ObjectId('4e4d5a7f1a2b3c4d5e6f7a89'),
              ],
              images: [
                'https://dogshome.com/wp-content/uploads/animalimages//1139184/556697c795ff443c8969ac1c81f9a95a-1728272579-1728272583_other.jpg',
              ],
              age: '5 years',
            },
          ],
        },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No pets found.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'No pets found.' },
        error: {
          type: 'string',
          example: 'No pets found.',
        },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  async gatAllPet() {
    const res = await this.scrollingService.getAll();

    if (res.message === 'No pets found.') {
      throw new NotFoundException('No pets found.');
    }
    return { Pets: res, statusCode: 200 };
  }

  @Roles(UserRole.USER)
  @Post('match')
  @ApiRoles(UserRole.USER)
  @ApiOperation({
    description:
      'This endpoint allows you to match a user with a pet. ' +
      'The user must provide their ID, longitude, latitude and range in **meters**. ' +
      'If the user is found, the endpoint will return a list of pets that match the user. ' +
      'If the user is not found or no pets are found, the endpoint will return an error message. ',
    summary: 'Match a user with a pet',
  })
  @ApiResponse({
    status: 200,
    description: 'Pets found.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Matched animals' },
        matchedAnimals: {
          type: 'array',
          items: {
            type: 'object',
          },
          example: [
            {
              _id: new ObjectId('48a1b2c3d4e5f6a7b8c9d0e2'),
              name: 'Spongebob',
              birthYear: 2023,
              birthMonth: 6,
              description: 'pochodzi z warszawy',
              gender: 'Pies',
              type: false,
              shelter: new ObjectId('60a1b2c3d4e5f6a7b8c9d0e1'),
              traits: [
                {
                  _id: new ObjectId('507f1f77bcf86cd799439011'),
                  name: 'Trait 1',
                  priority: 1,
                },
                {
                  _id: new ObjectId('5f50c31b1c9d440000a1b2c3'),
                  name: 'Trait 2',
                  priority: 2,
                },
              ],
              images: [
                'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
              ],
              age: '2 years',
            },
            {
              _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
              name: 'Pomelo',
              birthYear: 2022,
              birthMonth: 4,
              description: 'pochodzi z torunia',
              gender: 'Suka',
              type: true,
              shelter: new ObjectId('70f1a2b3c4d5e6f7a8b9c0d2'),
              traits: [
                {
                  _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8'),
                  name: 'Trait 3',
                  priority: 3,
                },
              ],
              images: [
                'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
              ],
              age: '3 years',
            },
          ],
        },
        userWithTraits: {
          type: 'object',
          example: {
            _id: new ObjectId('65f4c8e9f0a5a4d3b4a54321'),
            name: 'Piotr',
            lastname: 'Wiśniewski',
            email: 'piotr.wisniewski@example.com',
            password:
              '$2b$12$gio35jsogsDCsopFUrvYcOm8HEcedZ9aWqYpJnmuj.qWvEOFwzB0m',
            favourites: [0, 1, 2],
            traits: [
              {
                _id: new ObjectId('55e4d5a7f1a2b3c4d5e6f7a8'),
                name: 'Trait 2',
                animalTraits: [
                  new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8'),
                  new ObjectId('60c72b2f9b1d8e4a5f6e7d8c'),
                  new ObjectId('65a1b2c3d4e5f6a7b8c9d0e1'),
                ],
              },
              {
                _id: new ObjectId('70c72b2f9b1d8e4a5f6e7d8c'),
                name: 'Trait 3',
                animalTraits: [new ObjectId('55a4d5a7f1a2b3c4d5e6f7a8')],
              },
            ],
          },
        },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Possible error responses',
    content: {
      'application/json': {
        examples: {
          userNotFound: {
            summary: 'User not found',
            value: {
              message: 'User not found.',
              error: 'Not Found',
              statusCode: 404,
            },
          },
          animalsNotFound: {
            summary: 'Pets not found',
            value: {
              message: 'No pets found.',
              error: 'Not Found',
              statusCode: 404,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Invalid input.',
        },
        statusCode: {
          type: 'number',
          example: 400,
        },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: '60c72b2f9b1d8e4a5f6e7d8c' },
        lng: { type: 'number', example: 18.123456 },
        lat: { type: 'number', example: 54.123456 },
        range: { type: 'number', example: 100 },
      },
    },
  })
  async match(
    @Headers('Authorization') authHeader: string,
    @Body('lng') lng: number,
    @Body('lat') lat: number,
    @Body('range') range: number,
  ) {
    const token = await this.tokenService.getTokenFromHeader(authHeader);
    const userId = await this.tokenService.getUserIdFromToken(token);

    const mes = {
      message: 'Invalid input',
      statusCode: 400,
    };

    if (isNaN(lat) || isNaN(lng) || isNaN(range)) {
      return mes;
    }

    if (!mongoose.isValidObjectId(userId)) {
      return mes;
    }
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return mes;
    }
    if (range <= 0) {
      return mes;
    }

    const result = await this.scrollingService.match(
      new ObjectId(userId),
      lat,
      lng,
      range,
    );

    if (result.message === 'User not found.') {
      throw new NotFoundException('User not found.');
    }

    if (result.message === 'No pets found.') {
      throw new NotFoundException('No pets found.');
    }

    return { ...result, statusCode: 200 };
  }
}
