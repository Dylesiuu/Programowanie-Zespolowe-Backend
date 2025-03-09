import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
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

  async isFavouriteExists(email: string, favouriteId: number): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return false;
    return user.favourites.includes(favouriteId);
  }

  async addFavourite(email: string, favouriteId: number): Promise<User | null> {
    if (await this.isFavouriteExists(email, favouriteId)) return null;
    return this.userModel.findOneAndUpdate({ email }, { $push: { favourites: favouriteId } }, { new: true }).exec();
  }

  async removeFavourite(email: string, favouriteId: number): Promise<User | null> {
    if (!(await this.isFavouriteExists(email, favouriteId))) return null;
    return this.userModel.findOneAndUpdate({ email }, { $pull: { favourites: favouriteId } }, { new: true }).exec();
  }



}
