import { IsString, IsNotEmpty, IsArray, IsUrl } from 'class-validator';

export class CreateAnimalDto {
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
  @IsNotEmpty()
  traits: string[];

  @IsUrl()
  @IsNotEmpty()
  image: string;
}
