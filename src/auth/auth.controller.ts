import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController
{
  constructor(private authService: AuthService){}

  @Post('register')
  async register(@Body('email') email: string, @Body('pass') pass: string)
  {
    const res = await this.authService.register(email, pass);

    if (res.message === 'User with this email already exists')
    {
      throw new ConflictException('User with this email already exists');
    }

    return res;
  }
}
