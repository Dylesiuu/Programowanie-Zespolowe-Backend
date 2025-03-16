import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnimalTraitDocument = AnimalTrait & Document;

@Schema()
export class AnimalTrait {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  priority: number;
}

export const AnimalTraitSchema = SchemaFactory.createForClass(AnimalTrait);
