import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema} from 'mongoose';
import * as mongoose from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

@Schema()
export class Pet extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: string;

  @Prop({ required: true })
  discribtion: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  shelter: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AnimalTrait' }],
  })
  traits: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true })
  image: string;
}
export const PetSchema = SchemaFactory.createForClass(Pet);
