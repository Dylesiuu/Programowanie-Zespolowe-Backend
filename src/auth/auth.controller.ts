import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController 
{
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto)
  {
    const res = await this.authService.register(createUserDto);

    if (res.message === 'User with this email already exists')
    {
      throw new ConflictException('User with this email already exists');
    }

    return res;
  }
}
