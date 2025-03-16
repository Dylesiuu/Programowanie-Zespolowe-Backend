import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Pet } from './schema/pet.schema';
import { matchAnimals } from '../utils/matchAnimals';
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

    const user = await this.userModel.findById(userId);
    if (!user) {
      return { message: 'User not found.' };
    }

    const userWithTraits = (
      await this.userModel.findById(userId).populate('traits').exec()
    ).toObject();

    const allAnimalsTmp = await this.petModel.find().populate('traits').exec();

    const allAnimalsWithTraits = allAnimalsTmp.map((animal) =>
      animal.toObject(),
    );

    const result = matchAnimals(userWithTraits, allAnimalsWithTraits);

    return {
      message: 'Matched animals',
      matchedAnimals: result,
      userWithTraits: userWithTraits,
    };
  }
}
