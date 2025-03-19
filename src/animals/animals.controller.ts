import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalService: AnimalsService) {}

  @Post()
  async create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalService.create(createAnimalDto);
  }

  @Get()
  async findAll() {
    return this.animalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.animalService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.animalService.remove(id);
  }
}
