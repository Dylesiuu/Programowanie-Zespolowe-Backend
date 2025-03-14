import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { error, table } from 'console';
import { Model } from 'mongoose';
import { Pet } from './schema/pet.schema';

@Injectable()
export class ScrollingService {
    constructor(
        @InjectModel('Pet') private readonly petModel: Model<Pet>,
    ) {}


    async getPetbyIndex(id: string): Promise<Pet | { error: string }> {
        const index = parseInt(id);
        if (isNaN(index) || index < 0 ) {
            return { error: 'Index is Invalid.' };
          }
        const result = await this.petModel.findOne({ id: index }).exec();
          if(!result){
            return {error: 'Pet not found.'}
          }
        return result;
        
    }

    async getAll(): Promise<Pet[]> {
        return this.petModel.find().exec();
    }
        
    async getPetbyName(name: string): Promise<Pet[] | { error: string }> {
        const matchingPets = await this.petModel.find({ name: new RegExp(`^${name}$`, 'i') });

        if (matchingPets.length === 0) {
            return { error: 'Pet with that name not found.' };
        }

        return matchingPets;
    }

}
