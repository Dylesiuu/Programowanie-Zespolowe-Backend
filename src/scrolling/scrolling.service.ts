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
import { Shelter, ShelterDocument } from '../shelters/schemas/shelter.schema';

@Injectable()
export class ScrollingService {
  constructor(
    @InjectModel(Pet.name) private readonly petModel: Model<Pet>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(UserTrait.name)
    private readonly userTraitModel: Model<UserTraitDocument>,
    @InjectModel(AnimalTrait.name)
    private readonly animalTraitModel: Model<AnimalTraitDocument>,
    @InjectModel(Shelter.name)
    private readonly shelterModel: Model<ShelterDocument>,
  ) {}

  async getPetbyIndex(id: string): Promise<Pet | { message: string }> {
    if (!mongoose.isValidObjectId(id)) {
      return { message: 'Index is Invalid.' };
    }
    const index = new ObjectId(id);
    const result = await this.petModel.findOne({ _id: index });
    if (!result) {
      return { message: 'Pet not found.' };
    }
    return result;
  }

  async getAll(): Promise<Pet[] | { message: string }> {
    const result = await this.petModel.find();

    if (result.length === 0) {
      return { message: 'No pets found.' };
    }

    return result;
  }

  async getPetbyName(name: string): Promise<Pet[] | { message: string }> {
    if (!name || typeof name !== 'string') {
      return { message: 'Invalid input.' };
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      return { message: 'Name can only contain letters, numbers, and spaces.' };
    }

    if (name.length > 50) {
      return { message: 'Name is too long.' };
    }

    const sanitizedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    try {
      const matchingPets = await this.petModel.find({
        name: { $regex: `^${sanitizedName}$`, $options: 'i' },
      });

      if (matchingPets.length === 0) {
        return { message: 'Pet not found.' };
      }

      return matchingPets;
    } catch (error) {
      return { message: 'An message occurred while fetching pets.' };
    }
  }

  async match(
    userId: ObjectId,
    lat: number,
    lng: number,
    range: number,
  ): Promise<
    | { message: string; matchedAnimals: any[]; userWithTraits: any }
    | { message: string }
  > {
    let shelters = await this.shelterModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lat, lng], range / 6371000],
        },
      },
    });

    const allAnimals = await this.petModel.find({
      shelter: { $in: shelters.map((shelter) => shelter._id) },
    });

    shelters = null;

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

    if (result.length === 0) {
      return { message: 'No pets found.' };
    }

    return {
      message: 'Matched animals',
      matchedAnimals: result,
      userWithTraits: userWithTraits,
    };
  }
}
