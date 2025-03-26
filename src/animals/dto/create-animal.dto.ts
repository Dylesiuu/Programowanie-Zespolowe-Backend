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
//import { ApiProperty } from '@nestjs/swagger';

export class CreateAnimalDto {
  /*@ApiProperty({
    example: 'Lili',
    description: 'The name of the animal',
    required: true,
  })*/
  @IsString()
  @IsNotEmpty()
  name: string;

  /*@ApiProperty({
    example: 2020,
    description: 'Year of birth',
    required: true,
    minimum: 1990,
    maximum: 2025,
  })*/
  @IsInt()
  @Min(1990)
  @Max(2025)
  birthYear: number;

  /*@ApiProperty({
    example: 6,
    description: 'Month of birth (1-12)',
    required: true,
    minimum: 1,
    maximum: 12,
  })*/
  @IsInt()
  @Min(1)
  @Max(12)
  birthMonth: number;

  /*@ApiProperty({
    example: 'Znaleziona na drodze, bardzo przyjazna. W schronisku jest od ...',
    description: 'A description of the animal',
    required: true,
  })*/
  @IsString()
  @IsNotEmpty()
  description: string;

  /*@ApiProperty({
    example: 'Kotka',
    description: 'Gender of the animal',
    required: true,
  })*/
  @IsString()
  @IsNotEmpty()
  gender: string;

  /*@ApiProperty({
    example: true,
    description: 'Animal type: false -> Dog, true -> Cat',
    required: true,
  })*/
  @IsBoolean()
  @IsNotEmpty()
  type: boolean;

  /*@ApiProperty({
    example: '60af8845e13b1c002b1a1b45',
    description: 'Reference to the shelter (ObjectId)',
    required: true,
  })*/
  @IsMongoId()
  @IsNotEmpty()
  shelter: string;

  /*@ApiProperty({
    example: ['60af8845e13b1c002b1a1b46', '60af8845e13b1c002b1a1b47'],
    description: 'List of traits IDs (ObjectId)',
    required: true,
  })*/
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  traits: string[];

  /*@ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'List of images URLs',
    required: true,
  })*/
  @IsArray()
  @IsUrl({}, { each: true })
  @IsNotEmpty()
  images: string[];
}
