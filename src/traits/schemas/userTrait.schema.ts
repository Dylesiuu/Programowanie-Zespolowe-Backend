import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserTraitDocument = UserTrait & Document;

@Schema()
export class UserTrait {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AnimalTrait' }],
    default: [],
  })
  animalTraits: MongooseSchema.Types.ObjectId[];
}

export const UserTraitSchema = SchemaFactory.createForClass(UserTrait);
