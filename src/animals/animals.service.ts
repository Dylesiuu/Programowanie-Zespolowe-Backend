import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
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
    const animals = await this.animalModel.find();
    return animals.map((animal) => ({
      ...animal.toObject(),
      age: calculateAge(animal.birthYear, animal.birthMonth),
    }));
  }

  async findOne(id: ObjectId) {
    const animal = await this.animalModel.findById(id);
    if (!animal) {
      return false;
    }
    return {
      ...animal.toObject(),
      age: calculateAge(animal.birthYear, animal.birthMonth),
    };
  }

  async remove(id: ObjectId) {
    const animal = await this.animalModel.findByIdAndDelete(id);
    if (!animal) {
      return false;
    }
    return { message: 'Animal deleted successfully' };
  }
}
