import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, name, lastname } = createUserDto;

    const userExist = await this.userModel.findOne({ email });

    if (userExist) {
      return { message: 'User with this email already exists' };
    }

    const hashedpassword = await bcrypt.hash(password, 12);

    const user = await this.userModel.create({
      name,
      lastname,
      email,
      password: hashedpassword,
    });

    await user.save();

    return { message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const userExist = await this.userModel.findOne({ email });

    if (!userExist) {
      return { message: 'User does not exist' };
    }

    const valid = await bcrypt.compare(password, userExist.password);

    if (valid) {
      return { message: 'User logged successfully' };
    }

    return { message: 'Bad password' };
  }
}
