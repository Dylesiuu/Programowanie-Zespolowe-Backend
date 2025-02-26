import {
  Controller,
  Post,
  Get,
  Body,
  ConflictException,
  UnauthorizedException,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const res = await this.authService.register(createUserDto);

    if (res.message === 'User with this email already exists') {
      throw new ConflictException(res.message);
    }

    return res;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const res = await this.authService.login(email, password);

    if (res.message === 'User does not exist') {
      throw new UnauthorizedException(res.message);
    }

    if (res.message === 'Bad password') {
      throw new ConflictException(res.message);
    }

    return res;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const user = req.user;
    const token = user.token;
    return { message: 'User logged successfully', token };
  }
}
