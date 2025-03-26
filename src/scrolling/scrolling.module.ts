import { Module } from '@nestjs/common';
import { ScrollingService } from './scrolling.service';
import { ScrollingController } from './scrolling.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pet, PetSchema } from './schema/pet.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import {
  AnimalTrait,
  AnimalTraitSchema,
} from 'src/traits/schemas/animalTrait.schema';
import { UserTrait, UserTraitSchema } from '../traits/schemas/userTrait.schema';
import { Shelter, ShelterSchema } from 'src/shelters/schemas/shelter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pet.name, schema: PetSchema },
      { name: User.name, schema: UserSchema },
      { name: UserTrait.name, schema: UserTraitSchema },
      { name: AnimalTrait.name, schema: AnimalTraitSchema },
      { name: Shelter.name, schema: ShelterSchema },
    ]),
    ConfigModule,
  ],
  controllers: [ScrollingController],
  providers: [ScrollingService],
})
export class ScrollingModule {}
