import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { UserRole } from './roles/user-role.enum';
import { TokenService } from './token.service';

@Injectable()
export class GoogleAuth extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly tokenService: TokenService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos } = profile;

      const user = await this.userModel.findOne({ email: emails[0].value });

      if (user) {
        const payload = {
          email: user.email,
          sub: user._id,
          role: user.role,
        };
        const access_token =
          await this.tokenService.generateAccessToken(payload);
        const refresh_token =
          await this.tokenService.generateRefreshToken(payload);
        done(null, { access_token, refresh_token, userId: user._id, isFirstLogin: false });
      } else {
        const newUser = await this.userModel.create({
          name: name.givenName,
          lastname: name.familyName,
          email: emails[0].value,
          password: 'google-oauth',
          role: UserRole.USER,
        });

        await newUser.save();

        const payload = {
          email: newUser.email,
          sub: newUser._id,
          role: newUser.role,
        };
        const access_token =
          await this.tokenService.generateAccessToken(payload);
        const refresh_token =
          await this.tokenService.generateRefreshToken(payload);
        done(null, { access_token, refresh_token, userId: newUser._id, isFirstLogin: true });
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return done(new UnauthorizedException('Unauthorized'), false);
      }
      return done(
        new InternalServerErrorException('Internal server error'),
        false,
      );
    }
  }
}
