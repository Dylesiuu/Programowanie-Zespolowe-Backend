import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async updateUserName(email: string, newName: string): Promise<User | null> {
    return this.userModel.findOneAndUpdate({ email }, { name: newName }, { new: true }).exec();
  }

  async updateUserLastname(email: string, newLastname: string): Promise<User | null> {
    return this.userModel.findOneAndUpdate({ email }, { lastname: newLastname }, { new: true }).exec();
  }

  async updateUserPassword(email: string, updatePasswordDto: UpdatePasswordDto): Promise<User | null> {
    const { password } = updatePasswordDto;

    const hashedPassword = await bcrypt.hash(password, 12);

    return this.userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword }, 
      { new: true }
    ).exec();
  }

  async doesTraitExist(email: string, tagId: number): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('User not found');

    if (!user.traits) {
      return false;
    }

    return user.traits.some((trait) => trait.tagId === Number(tagId));
  }

  async addTrait(email: string, trait: { tagId: number; priority: number; name: string }) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    user.traits = user.traits || [];

    const exists = await this.doesTraitExist(email, trait.tagId);
    if (exists) throw new BadRequestException('Trait already exists');

    user.traits.push(trait);
    return this.userModel.findOneAndUpdate(
      { email },
      { $push: { traits: trait } },
      { new: true }
    ).exec();
  }

  async removeTrait(email: string, tagId: number) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    user.traits = user.traits || [];

    const exists = await this.doesTraitExist(email, tagId);
    if (!exists) throw new BadRequestException('Trait not found');

    user.traits = user.traits.filter((trait) => trait.tagId !== tagId);
    return this.userModel.findOneAndUpdate(
      { email },
      { $pull: { traits: { tagId } } },
      { new: true }
    ).exec();
  }

}
