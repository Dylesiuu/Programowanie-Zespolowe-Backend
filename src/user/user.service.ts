import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';
import e from 'express';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async updateUserName(email: string, newName: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    user.name = newName;
    return await user.save();
  }

  async updateUserLastname(email: string, newLastname: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    user.lastname = newLastname;
    return await user.save();
  }

  async updateUserPassword(email: string, updatePasswordDto: UpdatePasswordDto): Promise<User | null> {
    const { password } = updatePasswordDto;

    const hashedPassword = await bcrypt.hash(password, 12);

    return this.userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword }, 
      { new: true }
    );
  }

  async doesFavouriteExist(email: string, favouriteId: number): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    return user.favourites.includes(favouriteId);
  }
  
  async addFavourite(email: string, favourites: number[]) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    user.favourites = user.favourites || [];
    const newFavourites = favourites.filter(favouriteId => !user.favourites.includes(favouriteId));
  
    if (newFavourites.length > 0) {
      user.favourites = [...user.favourites, ...newFavourites];
    }
  
    return this.userModel.findOneAndUpdate(
      { email },
      { $set: { favourites: user.favourites } },
      { new: true }
    );
  }

  async removeFavourite(email: string, favourites: number[]) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    user.favourites = user.favourites || [];

    for (const favouriteId of favourites) {
      const exists = await this.doesFavouriteExist(email, favouriteId);
      if (exists) {
        user.favourites = user.favourites.filter(existingFavourite => existingFavourite !== favouriteId);
      }
    }

    return this.userModel.findOneAndUpdate(
      { email },
      { $set: { favourites: user.favourites } },
      { new: true }
    );
  }


  async doesTraitExist(email: string, tagId: number): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    if (!user.traits) {
      return false;
    }

    return user.traits.some((trait) => trait.tagId === Number(tagId));
  }



  async addTrait(email: string, traits:{ tagId: number; priority: number; name: string }[] ) {
    const user = await this.userModel.findOne({ email });
  if (!user) throw new NotFoundException('User not found');
  user.traits = user.traits || [];

  const newTraits = traits.filter(trait => !user.traits.some(existingTrait => existingTrait.tagId === trait.tagId));

  if (newTraits.length > 0) {
    user.traits = [...user.traits, ...newTraits];
  }

  return this.userModel.findOneAndUpdate(
    { email },
    { $set: { traits: user.traits } },
    { new: true }
  );
}

async removeTrait(email: string, traits: { tagId: number }[]) {
  const user = await this.userModel.findOne({ email });
  if (!user) throw new NotFoundException('User not found');
  user.traits = user.traits || [];

  for (const trait of traits) {
    const exists = await this.doesTraitExist(email, trait.tagId);
    if (exists) {
      user.traits = user.traits.filter(existingTrait => existingTrait.tagId !== trait.tagId);
    }
  }

  return this.userModel.findOneAndUpdate(
    { email },
    { $set: { traits: user.traits } },
    { new: true }
  );
}

}
