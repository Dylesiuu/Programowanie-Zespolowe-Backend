import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ShelterDocument = Shelter & Document;
@Schema()
export class Shelter {
  @Prop({ required: true })
  location: [number, number];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Pet' }] })
  animals: MongooseSchema.Types.ObjectId[];
}

export const ShelterSchema = SchemaFactory.createForClass(Shelter);
