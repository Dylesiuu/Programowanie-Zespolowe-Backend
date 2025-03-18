import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

@Schema()
export class Pet extends Document {
  @ApiProperty({
    example: 'Pomelo',
    description: 'The name of the pet',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: '2 lata',
    description: 'The age of the pet',
  })
  @Prop({ required: true })
  age: string;

  @ApiProperty({
    example: 'pochodzi z torunia',
    description: 'The description of the pet',
  })
  @Prop({ required: true })
  discribtion: string;

  @ApiProperty({
    example: 'Suka',
    description: 'The gender of the pet',
  })
  @Prop({ required: true })
  gender: string;

  @ApiProperty({
    example: 'Toruń',
    description: 'The location of the pet',
  })
  @Prop({ required: true })
  location: string;

  @ApiProperty({
    example: 'Schronisko dla zwierząt w Toruniu',
    description: 'The shelter where the animal is',
  })
  @Prop({ required: true })
  shelter: string;

  @ApiProperty({
    example: ['64d5a9e8f1b2c24d55a9e8f1'],
    description: 'List of trait IDs associated with the pet',
    type: [String],
  })
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AnimalTrait' }],
  })
  traits: MongooseSchema.Types.ObjectId[];

  @ApiProperty({
    example: 'https://example.com/pet-image.jpg',
    description: "The URL of the pet's image",
  })
  @Prop({ required: true })
  image: string;
}
export const PetSchema = SchemaFactory.createForClass(Pet);
