import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Pet } from './schema/pet.schema';
import { matchUserWithAnimals } from '../utils/matchUserWithAnimals';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  UserTrait,
  UserTraitDocument,
} from '../traits/schemas/userTrait.schema';
import {
  AnimalTrait,
  AnimalTraitDocument,
} from '../traits/schemas/animalTrait.schema';

@Injectable()
export class ScrollingService {
  constructor(
    @InjectModel(Pet.name) private readonly petModel: Model<Pet>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserTrait.name)
    private readonly userTraitModel: Model<UserTraitDocument>,
    @InjectModel(AnimalTrait.name)
    private readonly animalTraitModel: Model<AnimalTraitDocument>,
  ) {}

  async getPetbyIndex(id: string): Promise<Pet | { error: string }> {
    if (!mongoose.isValidObjectId(id)) {
      return { error: 'Index is Invalid.' };
    }
    const index = new ObjectId(id);
    const result = await this.petModel.findOne({ _id: index });
    if (!result) {
      return { error: 'Pet not found.' };
    }
    return result;
  }

  async getAll(): Promise<Pet[]> {
    return this.petModel.find();
  }

  async getPetbyName(name: string): Promise<Pet[] | { error: string }> {
    if (!name || typeof name !== 'string') {
      return { error: 'Invalid input.' };
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      return { error: 'Name can only contain letters, numbers, and spaces.' };
    }

    if (name.length > 50) {
      return { error: 'Name is too long.' };
    }

    const sanitizedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    try {
      const matchingPets = await this.petModel.find({
        name: { $regex: `^${sanitizedName}$`, $options: 'i' },
      });

      if (matchingPets.length === 0) {
        return { error: 'Pet not found.' };
      }

      return matchingPets;
    } catch (error) {
      return { error: 'An error occurred while fetching pets.' };
    }
  }

  async match(
    userId: ObjectId,
  ): Promise<
    | { message: string; matchedAnimals: any[]; userWithTraits: any }
    | { message: string }
  > {
    const allAnimals = await this.getAll();
    if (allAnimals.length === 0) {
      return { message: 'No pets found.' };
    }

    const user = await this.userModel.findById(userId).populate('traits');
    if (!user) {
      return { message: 'User not found.' };
    }

    const userWithTraits = user.toObject();

    const allAnimalsTmp = await this.petModel.find().populate('traits');

    const allAnimalsWithTraits = allAnimalsTmp.map((animal) =>
      animal.toObject(),
    );

    const result = matchUserWithAnimals(userWithTraits, allAnimalsWithTraits);

    return {
      message: 'Matched animals',
      matchedAnimals: result,
      userWithTraits: userWithTraits,
    };
  }
}
