import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
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
import { Animal, AnimalDocument } from '../animals/schemas/animal.schema';
import { calculateAge } from '../utils/calculateAge';

@Injectable()
export class ScrollingService {
  constructor(
    @InjectModel(Animal.name)
    private readonly animalModel: Model<AnimalDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(UserTrait.name)
    private readonly userTraitModel: Model<UserTraitDocument>,
    @InjectModel(AnimalTrait.name)
    private readonly animalTraitModel: Model<AnimalTraitDocument>,
    @InjectModel(Shelter.name)
    private readonly shelterModel: Model<ShelterDocument>,
  ) {}

  async getPetbyIndex(id: string): Promise<Animal | { message: string }> {
    if (!mongoose.isValidObjectId(id)) {
      return { message: 'Index is Invalid.' };
    }
    const index = new ObjectId(id);
    const result = await this.animalModel.findOne({ _id: index });
    if (!result) {
      return { message: 'Pet not found.' };
    }
    const animalWithAge = {
      ...result.toObject(),
      age: calculateAge(result.birthYear, result.birthMonth),
    };

    return animalWithAge;
  }

  async getAll(): Promise<Animal[] | { message: string }> {
    const result = await this.animalModel.find();

    if (result.length === 0) {
      return { message: 'No pets found.' };
    }

    const animalWithAge = result.map((animal) => ({
      ...animal.toObject(),
      age: calculateAge(animal.birthYear, animal.birthMonth),
    }));

    return animalWithAge;
  }

  async getPetbyName(name: string): Promise<Animal[] | { message: string }> {
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
      const matchingPets = await this.animalModel.find({
        name: { $regex: `^${sanitizedName}$`, $options: 'i' },
      });

      if (matchingPets.length === 0) {
        return { message: 'Pet not found.' };
      }

      const matchingPetsWithAge = matchingPets.map((animal) => ({
        ...animal.toObject(),
        age: calculateAge(animal.birthYear, animal.birthMonth),
      }));

      return matchingPetsWithAge;
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

    const allAnimals = await this.animalModel.find({
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

    const allAnimalsTmp = await this.animalModel.find().populate('traits');

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
