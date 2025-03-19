import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsUrl,
  IsInt,
  IsBoolean,
  IsMongoId,
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

  @IsBoolean()
  @IsNotEmpty()
  type: boolean;

  @IsMongoId()
  @IsNotEmpty()
  shelter: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  traits: string[];

  @IsArray()
  @IsUrl({}, { each: true })
  @IsNotEmpty()
  images: string[];
}
