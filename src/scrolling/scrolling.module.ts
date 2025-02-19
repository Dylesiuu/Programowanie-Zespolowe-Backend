import { Module } from '@nestjs/common';
import { ScrollingService } from './scrolling.service';
import { ScrollingController } from './scrolling.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pet, PetSchema } from './schema/pet.schema';
import { JwtModule } from '@nestjs/jwt';
import mongoose from 'mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '60m' },
        }),
        inject: [ConfigService],
      }),
      ConfigModule,],
  controllers: [ScrollingController],
  providers: [ScrollingService]
})
export class ScrollingModule {}
