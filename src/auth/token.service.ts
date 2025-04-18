import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schema/refreshToken.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
    });
  }

  async validateRefreshToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);
      const storedToken = await this.refreshTokenModel.findOne({
        _id: payload.sub,
      });
      if (
        !storedToken ||
        storedToken.expiresAt < new Date() ||
        storedToken.token !== token
      ) {
        return false; // Token is invalid or expired
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async saveRefreshToken(userId: ObjectId, token: string): Promise<boolean> {
    try {
      const expiresAt = new Date();
      expiresAt.setSeconds(
        expiresAt.getSeconds() +
          parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME) * 24 * 60 * 60,
      );

      const savedToken = await this.refreshTokenModel.create({
        userId,
        token,
        expiresAt,
        createdAt: new Date(),
      });

      return !!savedToken; // Returns true if savedToken is not null/undefined
    } catch (error) {
      console.error('Error saving refresh token:', error);
      return false;
    }
  }

  async deleteRefreshToken(userId: ObjectId): Promise<boolean> {
    try {
      const deletedToken = await this.refreshTokenModel.deleteMany({ userId });
      return deletedToken.deletedCount >= 0;
    } catch (error) {
      console.error('Error deleting refresh token:', error);
      return false;
    }
  }

  async getUserIdFromToken(token: string): Promise<ObjectId | null> {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.sub && ObjectId.isValid(payload.sub)) {
        return new ObjectId(payload.sub as string);
      }
      return null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
