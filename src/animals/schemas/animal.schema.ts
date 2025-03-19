import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MongoSchema } from 'mongoose';

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

  //0 -> dog, 1 -> cat
  @Prop({ required: true })
  type: boolean;

  @Prop({ type: MongoSchema.Types.ObjectId, required: true })
  shelter: ObjectId;

  @Prop({ type: [MongoSchema.Types.ObjectId], required: true })
  traits: ObjectId[];

  @Prop({ type: [String], required: true })
  images: string[];
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
