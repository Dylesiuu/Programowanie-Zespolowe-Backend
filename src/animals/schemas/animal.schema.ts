import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnimalDocument = Animal & Document;

@Schema()
export class Animal {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthYear: number;

  @Prop({ required: true })
  birthMonth: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  shelter: string;

  @Prop({ type: [String], required: true })
  traits: string[];

  @Prop({ required: true })
  image: string;
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
