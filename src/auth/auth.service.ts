import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './roles/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, name, lastname } = createUserDto;

    const userExist = await this.userModel.findOne({ email });

    if (userExist) {
      return {
        message: 'User with this email already exists',
        token: null,
        userId: null,
      };
    }

    const hashedpassword = await bcrypt.hash(password, 12);

    const user = await this.userModel.create({
      name,
      lastname,
      email,
      password: hashedpassword,
      role: UserRole.USER,
    });

    await user.save();

    const payload = { email: user.email, sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { message: 'User registered successfully', token, userId: user._id };
  }

  async login(email: string, password: string) {
    const userExist = await this.userModel.findOne({ email });

    if (!userExist) {
      return { message: 'User does not exist', token: null, userId: null };
    }

    const valid = await bcrypt.compare(password, userExist.password);

    if (valid) {
      const payload = {
        email: userExist.email,
        sub: userExist._id,
        role: userExist.role,
      };
      const token = this.jwtService.sign(payload);
      return {
        message: 'User logged successfully',
        token,
        userId: userExist._id,
      };
    }

    return { message: 'Bad password', token: null, userId: null };
  }
}
