import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AnimalDocument = Animal & Document;

@Schema()
export class Animal {
  @ApiProperty({
    example: 'Lili',
    description: 'The name of the animal',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 2020,
    description: 'Year of birth',
  })
  @Prop({ required: true })
  birthYear: number;

  @ApiProperty({
    example: 6,
    description: 'Month of birth (1-12)',
    minimum: 1,
    maximum: 12,
  })
  @Prop({ required: true })
  birthMonth: number;

  @ApiProperty({
    example: 'Znaleziona na drodze, bardzo przyjazna. W schronisku jest od ...',
    description: 'A description of the animal',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    example: 'Kotka',
    description: 'Gender of the animal',
  })
  @Prop({ required: true })
  gender: string;

  @ApiProperty({
    example: true,
    description: 'Animal type: false -> Dog, true -> Cat',
  })
  @Prop({ required: true })
  type: boolean;

  @ApiProperty({
    example: '60af8845e13b1c002b1a1b45',
    description: 'Reference to the shelter (ObjectId)',
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  shelter: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    example: ['60af8845e13b1c002b1a1b46', '60af8845e13b1c002b1a1b47'],
    description: 'List of traits IDs (ObjectId)',
  })
  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    required: true,
    ref: 'AnimalTrait',
  })
  traits: MongooseSchema.Types.ObjectId[];

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'List of images URLs',
  })
  @Prop({ type: [String], required: true })
  images: string[];
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
