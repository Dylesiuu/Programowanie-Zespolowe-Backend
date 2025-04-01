import { IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePetDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the Pet',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    example: 'Rex',
    description: 'The name of the Pet',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '2 lata',
    description: 'The age of the Pet',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  age: string;

  @ApiProperty({
    example: 'Przyjazny',
    description: 'The description of the Pet',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'Suka',
    description: 'The sex of the Pet',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    example: 'New York',
    description: 'The location of the Pet',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: 'New York Schronisko',
    description: 'The shelter of the Pet',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  shelter: string;

  @ApiProperty({
    example: ['przyjacielski', 'aktywny'],
    description: 'The traits of the Pet',
    required: true
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  traits: string[];

  @ApiProperty({
    example: 'https://www.google.com',
    description: 'The image of the Pet',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}