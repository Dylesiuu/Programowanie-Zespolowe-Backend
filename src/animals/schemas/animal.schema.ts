import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnimalDocument = Animal & Document;

@Schema()
export class Animal {
  @Prop({ type: [String], required: true })
  traits: number[];
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
