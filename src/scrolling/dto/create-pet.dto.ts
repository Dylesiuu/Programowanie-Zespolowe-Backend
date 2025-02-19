import { IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator';

export class CreatePetDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  age: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  shelter: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  traits: string[];

  @IsString()
  @IsNotEmpty()
  image: string;
}