import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Animal, AnimalDocument } from './schemas/animal.schema';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { calculateAge } from '../utils/calculateAge';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
  ) {}

  async create(createAnimalDto: CreateAnimalDto) {
    const animal = await this.animalModel.create(createAnimalDto);
    return { message: 'Animal created successfully', animal };
  }

  async findAll() {
    const animals = await this.animalModel.find().exec();
    return animals.map((animal) => ({
      ...animal.toObject(),
      age: calculateAge(animal.birthYear, animal.birthMonth),
    }));
  }

  async findOne(id: string) {
    const animal = await this.animalModel.findById(id).exec();
    return {
      ...animal.toObject(),
      age: calculateAge(animal.birthYear, animal.birthMonth),
    };
  }

  async remove(id: string) {
    const animal = await this.animalModel.findByIdAndDelete(id).exec();
    return { message: 'Animal deleted successfully' };
  }
}
