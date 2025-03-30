import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schema/refreshToken.schema';
import { Model } from 'mongoose';
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
      if (!storedToken || storedToken.expiresAt < new Date()) {
        return false; // Token is invalid or expired
      }

      return true;
    } catch (error) {
      return false; // Token is invalid
    }
  }
}
