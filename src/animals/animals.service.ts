import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Animal, AnimalDocument } from './schemas/animal.schema';
import { CreateAnimalDto } from './dto/create-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
  ) {}

  async create(createAnimalDto: CreateAnimalDto) {
    const { name, age, description, gender, location, shelter, traits, image } =
      createAnimalDto;

    const animal = await this.animalModel.create({
      name,
      age,
      description,
      gender,
      location,
      shelter,
      traits,
      image,
    });

    await animal.save();

    return { message: 'Animal created successfully', animal };
  }

  async findAll() {
    const animals = await this.animalModel.find().exec();
    return animals;
  }
}
