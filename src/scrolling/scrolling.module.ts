import { Module } from '@nestjs/common';
import { ScrollingService } from './scrolling.service';
import { ScrollingController } from './scrolling.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from '../user/schemas/user.schema';
import {
  AnimalTrait,
  AnimalTraitSchema,
} from 'src/traits/schemas/animalTrait.schema';
import { UserTrait, UserTraitSchema } from '../traits/schemas/userTrait.schema';
import { Shelter, ShelterSchema } from 'src/shelters/schemas/shelter.schema';
import { Animal, AnimalSchema } from 'src/animals/schemas/animal.schema';
import { TokenService } from 'src/auth/token.service';
import { JwtModule } from '@nestjs/jwt';
import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/auth/schema/refreshToken.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Animal.name, schema: AnimalSchema },
      { name: User.name, schema: UserSchema },
      { name: UserTrait.name, schema: UserTraitSchema },
      { name: AnimalTrait.name, schema: AnimalTraitSchema },
      { name: Shelter.name, schema: ShelterSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    ConfigModule,
  ],
  controllers: [ScrollingController],
  providers: [ScrollingService, TokenService],
})
export class ScrollingModule {}
