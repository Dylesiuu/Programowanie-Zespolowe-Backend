import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsUrl,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1990)
  @Max(2025)
  birthYear: number;

  @IsInt()
  @Min(1)
  @Max(12)
  birthMonth: number;

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
