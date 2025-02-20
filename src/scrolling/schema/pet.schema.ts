import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

@Schema()
export class Pet extends Document {
  @Prop({ unique: true})
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: string;

  @Prop({ required: true})
  discribtion: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  shelter: string;

  @Prop({ required: true, type: [String] })
  traits: string[];

  @Prop({ required: true})
  image: string;
}
export const PetSchema = SchemaFactory.createForClass(Pet);
PetSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 0 });
