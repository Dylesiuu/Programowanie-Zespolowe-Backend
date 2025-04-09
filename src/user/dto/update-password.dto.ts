import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'haslO2452345923582fnw823#',
    description: 'The password of the User',
    required: true,
    pattern:
      '/^(?=.*[A-Z])(?=.*[a-z])(?=.*d)(?=.*[@$!%*?&#])[A-Za-zd@$!%*?&#]{8,}$/',
    minLength: 12,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(12, { message: 'Password must be at least 12 characters long.' })
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}
