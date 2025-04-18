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
import {
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@ApiTags('AuthenticationController')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'This endpoint allows a new user to register in the system. ' +
      'The user must provide a valid email and a password that meets the security requirements. ' +
      'If the email is already registered, the endpoint will return an error, otherwise returns user data and JWT token.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User registered successfully' },
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjIsInJvbGUiOiJ1c2VyIn0.5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA',
        },
        userId: { type: 'number', example: 1 },
        statusCode: { type: 'number', example: 201 },
      },
    },
  })
  @ApiConflictResponse({
    description: 'User with this email already exists',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User with this email already exists',
        },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    const res = await this.authService.register(createUserDto);

    if (res.message === 'User with this email already exists') {
      throw new ConflictException(res.message);
    }

    return { ...res, statusCode: 201 };
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login a user',
    description:
      'This endpoint allows an existing user to log in to the system. ' +
      'The user must provide a valid email and password. ' +
      'If the email or password is incorrect, the endpoint will return an error, otherwise returns user data and JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User logged successfully' },
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvcmRhbiBEb2UiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMiwicm9sZSI6InVzZXIifQ.5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA',
        },
        userId: { type: 'number', example: 1 },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Bad password',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Bad password' },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User does not exist',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User does not exist' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@example.com' },
        password: { type: 'string', example: 'haslO2452345923582fnw823#' },
      },
    },
  })
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

    return { ...res, statusCode: 200 };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Initiate Google OAuth login',
    description: 'Redirects the user to Google OAuth consent screen.',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google OAuth page.',
  })
  async googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Google OAuth callback',
    description:
      'Endpoint called by Google after user authentication. Returns user data and JWT token.',
  })
  @ApiOkResponse({
    description: 'User logged in successfully via Google.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User logged successfully' },
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvcmRhbiBEb2UiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMiwicm9sZSI6InVzZXIifQ.5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA',
        },
        userId: { type: 'number', example: 1 },
        isFirstLogin: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'User authentication failed.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = req.user;
    const token = user.token;
    const userId = user.userId;
    const isFirstLogin = user.isFirstLogin;

    const redirectUrl = `success?returnURL=${process.env.FRONTEND_URL}/auth/google/token=${token}&userId=${userId}&isFirstLogin=${isFirstLogin}`;

    return res.redirect(redirectUrl);
  }
}
