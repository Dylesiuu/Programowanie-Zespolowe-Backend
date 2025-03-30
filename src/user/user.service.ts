import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

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
    return this.userModel.findOneAndUpdate(
      { email },
      { name: newName },
      { new: true },
    );
  }

  async updateUserLastname(
    email: string,
    newLastname: string,
  ): Promise<User | null> {
    return this.userModel.findOneAndUpdate(
      { email },
      { lastname: newLastname },
      { new: true },
    );
  }

  async updateUserPassword(
    email: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User | null> {
    const { password } = updatePasswordDto;

    const hashedPassword = await bcrypt.hash(password, 12);

    return this.userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true },
    );
  }

  async updateUserRole(
    id: ObjectId,
    newRole: string,
  ): Promise<{ message: string }> {
    const validRoles = ['admin', 'user', 'employee'];

    if (!validRoles.includes(newRole)) {
      return { message: 'Invalid role' };
    }
    const user = await this.userModel.findOneAndUpdate(
      { _id: id },
      { role: newRole },
      { new: true },
    );

    if (!user) {
      return { message: 'User not found' };
    }

    return { message: 'User role updated successfully' };
  }

  //Fix later, commented out due to bugs
  /*
  async doesTraitExist(email: string, tagId: ObjectId): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    if (!user.traits) {
      return false;
    }

    return user.traits.some(trait => );
  }

  async addTrait(
    email: string,
    trait: { tagId: number; priority: number; name: string },
  ) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    user.traits = user.traits || [];

    const exists = await this.doesTraitExist(email, trait.tagId);
    if (exists) throw new BadRequestException('Trait already exists');

    user.traits.push(trait);
    return this.userModel
      .findOneAndUpdate({ email }, { $push: { traits: trait } }, { new: true });
  }

  async removeTrait(email: string, tagId: number) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    user.traits = user.traits || [];

    const exists = await this.doesTraitExist(email, tagId);
    if (!exists) throw new BadRequestException('Trait not found');

    user.traits = user.traits.filter((trait) => trait.tagId !== tagId);
    return this.userModel
      .findOneAndUpdate(
        { email },
        { $pull: { traits: { tagId } } },
        { new: true },
      );
  }*/
}
