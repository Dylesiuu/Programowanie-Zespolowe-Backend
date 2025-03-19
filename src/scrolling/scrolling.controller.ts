import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ScrollingService } from './scrolling.service';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pet } from './schema/pet.schema';

@ApiTags('ScrollingController')
@Controller('scrolling')
export class ScrollingController {
  private scrollingService;

  constructor(scrollingService: ScrollingService) {
    this.scrollingService = scrollingService;
  }

  @Get(':arg')
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
    type: Pet,
    example: {
      _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
      name: 'Pomelo',
      age: '2 lata',
      discribtion: 'pochodzi z torunia',
      gender: 'Suka',
      location: 'Toruń',
      shelter: 'Schronisko dla zwierząt w Toruniu',
      traits: [new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8')],
      image:
        'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No pet found.',
    schema: {
      type: 'object',
      properties: {
        error: {
          type: 'string',
          example: 'Pet not found.',
        },
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
              error: 'Name is too long.',
            },
          },
          incorrectName: {
            summary: 'Incorrect name',
            value: {
              error: 'Name can only contain letters, numbers, and spaces.',
            },
          },
          invalidName: {
            summary: 'Invalid input.',
            value: {
              error: 'Invalid input.',
            },
          },
        },
      },
    },
  })
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
    type: [Pet],
    example: [
      {
        _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
        name: 'Pomelo',
        age: '2 lata',
        discribtion: 'pochodzi z torunia',
        gender: 'Suka',
        location: 'Toruń',
        shelter: 'Schronisko dla zwierząt w Toruniu',
        traits: [new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8')],
        image:
          'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
      },
      {
        _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7b9'),
        name: 'Spongebob',
        age: '4 lata',
        discribtion: 'pochodzi z bydgoszczy',
        gender: 'Pies',
        location: 'Bydgoszcz',
        shelter: 'Schronisko dla Zwierząt w Bydgoszczy',
        traits: [
          new ObjectId('507f1f77bcf86cd799439011'),
          new ObjectId('4e4d5a7f1a2b3c4d5e6f7a89'),
        ],
        image:
          'https://dogshome.com/wp-content/uploads/animalimages//1139184/556697c795ff443c8969ac1c81f9a95a-1728272579-1728272583_other.jpg',
      },
    ],
  })
  @ApiResponse({
    status: 404,
    description: 'No pets found.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
    example: [],
  })
  gatAllPet() {
    return this.scrollingService.getAll();
  }

  @Post('match')
  @ApiOperation({
    description:
      'This endpoint allows you to match a user with a pet. ' +
      'The user must provide their ID, longitude, and latitude. ' +
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
              age: '1 rok',
              discribtion: 'pochodzi z warszawy',
              gender: 'Pies',
              location: 'Warszawa',
              shelter: 'Schronisko na Paluchu',
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
              image:
                'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
            },
            {
              _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
              name: 'Pomelo',
              age: '2 lata',
              discribtion: 'pochodzi z torunia',
              gender: 'Suka',
              location: 'Toruń',
              shelter: 'Schronisko dla zwierząt w Toruniu',
              traits: [
                {
                  _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8'),
                  name: 'Trait 3',
                  priority: 3,
                },
              ],
              image:
                'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
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
            password: 'mypassword789',
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
              message: 'user not found',
            },
          },
          petsNotFound: {
            summary: 'Pets not found',
            value: {
              message: 'pets not found',
            },
          },
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
    @Body('userId') userId: string,
    @Body('lng') lng: number,
    @Body('lat') lat: number,
    @Body('range') range: number,
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
