import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { Animal, AnimalSchema } from './schemas/animal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Animal.name, schema: AnimalSchema }]),
  ],
  controllers: [AnimalsController],
  providers: [AnimalsService],
})
export class AnimalsModule {}
