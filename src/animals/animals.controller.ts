import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
//import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

//@ApiTags('Animals')
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalService: AnimalsService) {}

  @Post()
  /*@ApiOperation({
    summary: 'Add new animal to the database',
    description:
        'This endpoint allows you to create a new animal in the database. ' +
        'It requires a valid JSON payload containing all required animal attributes.',
  })
  @ApiResponse({
    status: 201,
    description: 'Animal created successfully.',
    example: {
      message: 'Animal created successfully',
      animal: {
        name: 'Rex',
        birthYear: 2019,
        birthMonth: 4,
        description: 'Super aktywny pies wyścigowy',
        gender: 'Pies',
        type: false,
        shelter: '60af8845e13b1c002b1a1b45',
        traits: [
          '60af8845e13b1c002b1a1b46',
          '60af8845e13b1c002b1a1b47',
        ],
        images: ['https://example.com/rex.jpg'],
        _id: '60af8845e13b1c002b1a1b45',
        __v: 0,
      },

    },
  })
  @ApiResponse({
    description: 'Bad request. Missing or invalid fields.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'birthYear must not be less than 1990',
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })*/
  async create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalService.create(createAnimalDto);
  }

  @Get()
  /*@ApiOperation({
    summary: 'Get all animals from the database',
    description:
        'This endpoint returns an array of all animals in the database. ' +
        'If there are no animals, it returns an empty array.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of animals found.',
    example: [
      {
        _id: '72f1a2b3c4d5e6f7a8b9c0d3',
        name: 'Pomelo',
        birthYear: 2021,
        birthMonth: 4,
        description: 'Znaleziony na ulicy ...',
        gender: 'Pies',
        type: false,
        shelter: '67e43f57a3e76642c12def68',
        traits: [
          '63e4d5a7f1a2b3c4d5e6f7a8'
        ],
        images: [
          'https://example.com/pomelo.jpg'
        ],
        __v: 0,
        age: '4 years'
      },
      {
        _id: '63e4d5a7f1a2b3c4d5e6f7b9',
        name: 'Spongebob',
        birthYear: 2019,
        birthMonth: 3,
        description: 'Spongebob jest u nas już po raz drugi',
        gender: 'Pies',
        type: false,
        shelter: '63e4d5a7f1a2b3c4d5e6f7b4',
        traits: [
          '507f1f77bcf86cd799439011',
          '4e4d5a7f1a2b3c4d5e6f7a89',
        ],
        images: ['https://example.com/spongebob.jpg'],
        __v: 0,
        age: '6 years'
      },
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'No animals found.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
    example: [],
  })*/
  async findAll() {
    return this.animalService.findAll();
  }

  @Get(':id')
  /*@ApiOperation({
    summary: 'Get an animal by ID from the database',
    description:
      'This endpoint retrieves a specific animal from the database using its ID. ' +
      'If the ID is valid but not found, it returns a 404 error. Returns 400 if ID is invalid.',
  })
  @ApiResponse({
    status: 200,
    description: 'Animal found.',
    example: {
      _id: '507f191e810c19729de860ea',
      name: 'Rex',
      birthYear: 2019,
      birthMonth: 4,
      description: 'Super aktywny pies wyścigowy',
      gender: 'Pies',
      type: false,
      shelter: '60af8845e13b1c002b1a1b45',
      traits: [
        '60af8845e13b1c002b1a1b46',
        '60af8845e13b1c002b1a1b47',
      ],
      images: ['https://example.com/rex.jpg'],
      __v: 0,
      age: '6 years'
    },
  })
  @ApiResponse({
    description: 'Invalid ObjectId format.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Invalid ObjectId format.',
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    description: 'Animal not found.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Animal not found.',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })*/
  async findOne(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId format.');
    }
    const animal = await this.animalService.findOne(new ObjectId(id));
    if (animal) {
      return animal;
    } else {
      throw new NotFoundException('Animal not found.');
    }
  }

  @Delete(':id')
  /*@ApiOperation({
    summary: 'Delete an animal by ID',
    description:
        'This endpoint allows you to delete an animal by its ID from the database. ',
  })
  @ApiResponse({
    status: 200,
    description: 'Animal successfully deleted.',
    example: { message: 'Animal deleted successfully' },
  })
  @ApiResponse({
    description: 'Invalid ObjectId format.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Invalid ObjectId format.',
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiResponse({
    description: 'Animal not found.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Animal not found.',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })*/
  async remove(@Param('id') id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ObjectId format.');
    }
    const animal = await this.animalService.remove(new ObjectId(id));
    if (animal) {
      return animal;
    } else {
      throw new NotFoundException('Animal not found.');
    }
  }
}
