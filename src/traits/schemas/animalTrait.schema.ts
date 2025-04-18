import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AnimalTraitDocument = AnimalTrait & Document;

@Schema()
export class AnimalTrait {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  priority: number;

  @Prop({ required: true })
  collectionId: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'AnimalTrait',
    required: true,
  })
  conflicts: MongooseSchema.Types.ObjectId;
}

export const AnimalTraitSchema = SchemaFactory.createForClass(AnimalTrait);
