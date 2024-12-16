import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController
{
  constructor(private authService: AuthService){}

  @Post('register')
  async register(@Body('name') name: string, @Body('lastname') lastName: string, @Body('email') email: string, @Body('password') password: string)
  {
    console.log(lastName);
    const res = await this.authService.register(name, lastName, email, password);

    if (res.message === 'User with this email already exists')
    {
      throw new ConflictException('User with this email already exists');
    }

    return res;
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string)
  {
      const res = await this.authService.login(email, password);

      if (res.message === 'User does not exist')
      {
          throw new ConflictException('User does not exist');
      }

    if (res.message === 'Bad password')
    {
        throw new ConflictException('Bad password');
    }

    return res;
  }
}
