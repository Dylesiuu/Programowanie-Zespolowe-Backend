import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserRole } from './roles/user-role.enum';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly tokenService: TokenService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, name, lastname } = createUserDto;

    const userExist = await this.userModel.findOne({ email });

    if (userExist) {
      return {
        message: 'User with this email already exists',
        access_token: null,
        refresh_token: null,
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

    const payload = { email: user.email, sub: user._id, role: user.role };
    const access_token = await this.tokenService.generateAccessToken(payload);
    const refresh_token = await this.tokenService.generateRefreshToken(payload);

    const userSaved = await user.save();

    if (!userSaved) {
      return {
        message: 'Error while saving user',
        access_token: null,
        refresh_token: null,
        userId: null,
      };
    }
    const tokenDeleted = await this.tokenService.deleteRefreshToken(
      user._id as ObjectId,
    );

    if (!tokenDeleted) {
      return {
        message: 'Error while deleting refresh token',
        access_token: null,
        refresh_token: null,
        userId: null,
      };
    }

    const tokenSaved = await this.tokenService.saveRefreshToken(
      user._id as ObjectId,
      refresh_token,
    );

    if (!tokenSaved) {
      return {
        message: 'Error while saving refresh token',
        access_token: null,
        refresh_token: null,
        userId: null,
      };
    }

    return {
      message: 'User registered successfully',
      access_token,
      refresh_token,
      userId: user._id,
    };
  }

  async login(email: string, password: string) {
    const userExist = await this.userModel.findOne({ email });

    if (!userExist) {
      return {
        message: 'User does not exist',
        access_token: null,
        refresh_token: null,
        userId: null,
      };
    }

    const valid = await bcrypt.compare(password, userExist.password);

    if (valid) {
      const payload = {
        email: userExist.email,
        sub: userExist._id,
        role: userExist.role,
      };
      const access_token = await this.tokenService.generateAccessToken(payload);
      const refresh_token =
        await this.tokenService.generateRefreshToken(payload);

      const tokenDeleted = await this.tokenService.deleteRefreshToken(
        userExist._id as ObjectId,
      );

      if (!tokenDeleted) {
        return {
          message: 'Error while deleting refresh token',
          access_token: null,
          refresh_token: null,
          userId: null,
        };
      }

      const tokenSaved = await this.tokenService.saveRefreshToken(
        userExist._id as ObjectId,
        refresh_token,
      );
      if (!tokenSaved) {
        return {
          message: 'Error while saving refresh token',
          access_token: null,
          refresh_token: null,
          userId: null,
        };
      }

      return {
        message: 'User logged successfully',
        access_token,
        refresh_token,
        userId: userExist._id,
      };
    }

    return {
      message: 'Bad password',
      access_token: null,
      refresh_token: null,
      userId: null,
    };
  }
}
