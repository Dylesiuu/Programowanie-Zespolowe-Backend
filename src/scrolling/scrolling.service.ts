import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Pet } from './schema/pet.schema';
import { matchAnimals } from '../utils/matchAnimals';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class ScrollingService {
  constructor(
    @InjectModel('Pet') private readonly petModel: Model<Pet>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getPetbyIndex(id: string): Promise<Pet | { error: string }> {
    const index = parseInt(id);
    if (isNaN(index) || index < 0) {
      return { error: 'Index is Invalid.' };
    }
    const result = await this.petModel.findOne({ id: index }).exec();
    if (!result) {
      return { error: 'Pet not found.' };
    }
    return result;
  }

  async getAll(): Promise<Pet[]> {
    return this.petModel.find();
  }

  async getPetbyName(name: string): Promise<Pet[] | { error: string }> {
    const matchingPets = await this.petModel.find({
      name: new RegExp(`^${name}$`, 'i'),
    });

    if (matchingPets.length === 0) {
      return { error: 'Pet with that name not found.' };
    }

    return matchingPets;
  }

  async match(userId: ObjectId): Promise<Pet[] | { message: string }> {
    const allAnimals = await this.getAll();
    if (allAnimals.length === 0) {
      return { message: 'No pets found.' };
    }

    const user = await this.userModel.findById(userId);
    if (user) {
      return matchAnimals(user, allAnimals);
    }

    return { message: 'User not found.' };
  }
}
