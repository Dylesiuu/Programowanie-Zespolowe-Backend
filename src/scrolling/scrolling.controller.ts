import { Controller, Get, Param } from '@nestjs/common';
import { ScrollingService } from './scrolling.service';
import {
  ApiParam,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { error } from 'console';

@ApiTags('ScrollingPageController')
@Controller('scrolling')
export class ScrollingController {
  private scrollingService;

  constructor(scrollingService: ScrollingService) {
    this.scrollingService = scrollingService;
  }

  @Get(':arg')
  @ApiOperation({
    summary: 'Return pet by index or name',
    description:
      'This endpoint allows the user to display the animal by index or name.',
  })
  @ApiParam({
    name: 'arg',
    description: 'Can be either an ID (number) or a name (string)',
    type: String,
    example: '1', 
  })
  @ApiResponse({
    status: 200,
    description: 'Return pet by index or name',
    schema: {
      type: 'array',
      items: {
        properties: {
          _id : { type: 'string', example: "67d6d4f5bda9044" },
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Rex' },
          age: { type: 'string', example: '2 lata' },
          description: { type: 'string', example: 'Przyjazny' },
          gender: { type: 'string', example: "Suka" },
          location: { type: 'string', example: 'New York' },
          shelter: { type: 'string', example: 'New York Schronisko' },
          traits: { type: 'array', example: ['przyjacielski', 'aktywny'] },
          image: { type: 'string', example: 'https://www.google.com' },
          },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Pet not found by name',
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string', example: "Pet with that name not found." },
      },
    },
  })
  getData(@Param('arg') arg: string) {
    const isInteger = (value: string): boolean => {
      return !isNaN(parseInt(value, 10));
    };
    if (isInteger(arg)) {
      return this.scrollingService.getPetbyIndex(arg);
    } else {
      return this.scrollingService.getPetbyName(arg);
    }
  }

  @Get('')
  @ApiOperation({
    summary: 'Return all pets from database',
    description:
      'This endpoint allows the administrator to display the entire table of animals.',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all pets from database',
    schema: {
      type: 'array',
      items: {
        properties: {
          _id : { type: 'string', example: "67d6d4f5bda9044" },
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Rex' },
          age: { type: 'string', example: '2 lata' },
          description: { type: 'string', example: 'Przyjazny' },
          gender: { type: 'string', example: "Suka" },
          location: { type: 'string', example: 'New York' },
          shelter: { type: 'string', example: 'New York Schronisko' },
          traits: { type: 'array', example: ['przyjacielski', 'aktywny'] },
          image: { type: 'string', example: 'https://www.google.com' },
          },
      },
    },
  })
  gatAllPet() {
    return this.scrollingService.getAll();
  }
}
