import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';




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

  async doesFavouriteExist(email: string, favouriteId: MongooseSchema.Types.ObjectId): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    return user.favourites.includes(favouriteId);
  }
  
  async addFavourite(email: string, favourites: MongooseSchema.Types.ObjectId[]) {
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

  async removeFavourite(email: string, favourites: MongooseSchema.Types.ObjectId[]) {
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




  async doesTraitExist(email: string, tagId: MongooseSchema.Types.ObjectId): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    if (!user.traits) {
      return false;
    }

    return user.traits.some((trait) => trait == tagId);
  }

  



  async addTrait(email: string, traits: MongooseSchema.Types.ObjectId[] ) {
    const user = await this.userModel.findOne({ email });
  if (!user) throw new NotFoundException('User not found');
  user.traits = user.traits || [];

  const newTraits = traits.filter(trait => !user.traits.some(existingTrait => existingTrait == trait));

  if (newTraits.length > 0) {
    user.traits = [...user.traits, ...newTraits];
  }

  return this.userModel.findOneAndUpdate(
    { email },
    { $set: { traits: user.traits } },
    { new: true }
  );
}

async removeTrait(email: string, traits: MongooseSchema.Types.ObjectId[]) {
  const user = await this.userModel.findOne({ email });
  if (!user) throw new NotFoundException('User not found');
  user.traits = user.traits || [];

  for (const trait of traits) {
    const exists = await this.doesTraitExist(email, trait);
    if (exists) {
      user.traits = user.traits.filter(existingTrait => existingTrait !== trait);
    }
  }

  return this.userModel.findOneAndUpdate(
    { email },
    { $set: { traits: user.traits } },
    { new: true }
  );
}

}
