import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

interface Trait {
  tagId: number;
  priority: number;
  name: string;
}

@Schema()
class TraitClass {
  @Prop({ required: true })
  tagId: number;

  @Prop({ required: true })
  priority: number;

  @Prop({ required: true })
  name: string;
}

const TraitSchema = SchemaFactory.createForClass(TraitClass);

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [] })
  favourites: number[];

  @Prop()
  traits: [
    {
      tagId: number;
      priority: number;
      name: string;
    },
  ];
}

export const UserSchema = SchemaFactory.createForClass(User);
