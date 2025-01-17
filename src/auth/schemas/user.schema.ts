import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import * as mongoose from 'mongoose';
// import * as AutoIncrementFactory from 'mongoose-sequence';

export type UserDocument = User & Document;

@Schema()
export class User {
  // @Prop({ unique: true })
  // id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  favourites: number[];
}
//const AutoIncrement = AutoIncrementFactory(mongoose.connection);
export const UserSchema = SchemaFactory.createForClass(User);

//UserSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 0 });
