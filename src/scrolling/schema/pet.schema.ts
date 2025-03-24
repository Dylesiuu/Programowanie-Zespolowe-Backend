import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

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
    example: '64d5a9e8f1b2c24d55b7e3f2',
    description: 'Id of the shelter where the animal is located',
  })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Pet' }] })
  shelter: MongooseSchema.Types.ObjectId;

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
