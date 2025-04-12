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
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './roles/user-role.enum';

@Injectable()
export class GoogleAuth extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
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
        const token = this.jwtService.sign(payload);
        done(null, { token, userId: user._id, isFirstLogin: false });
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
        const token = this.jwtService.sign(payload);
        done(null, { token, userId: newUser._id, isFirstLogin: true });
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
