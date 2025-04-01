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
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { Response } from 'express';
import { TokenService } from './token.service';
import { ObjectId } from 'mongoose';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './roles/user-role.enum';
import { ApiRoles } from 'src/decorators/api-roles.decorator';

@ApiTags('AuthenticationController')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

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
  @ApiInternalServerErrorResponse({
    description: 'Error while saving or deleting user or token',
    content: {
      'application/json': {
        examples: {
          refreshTokenSavedError: {
            summary: 'Error while saving refresh token',
            value: {
              message: 'Error while saving refresh token',
              error: 'Internal Server Error',
              statusCode: 500,
            },
          },
          refreshTokenDeletedError: {
            summary: 'Error while deleting refresh token',
            value: {
              message: 'Error while deleting refresh token',
              error: 'Internal Server Error',
              statusCode: 500,
            },
          },
          userSavedError: {
            summary: 'Error while saving user',
            value: {
              message: 'Error while saving user',
              error: 'Internal Server Error',
              statusCode: 500,
            },
          },
        },
      },
    },
  })
  @ApiBody({ type: CreateUserDto })
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const res = await this.authService.register(createUserDto);

    if (res.message === 'User with this email already exists') {
      throw new ConflictException(res.message);
    }

    if (res.message === 'Error while saving user') {
      throw new InternalServerErrorException(res.message);
    }
    if (res.message === 'Error while saving refresh token') {
      throw new InternalServerErrorException(res.message);
    }

    const token = res.access_token;
    const message = res.message;

    response.cookie('refresh_token', res.refresh_token, {
      httpOnly: true, // Prevents JS access
      secure: true, // HTTPS only
      sameSite: 'strict', // Prevents CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { token, message, statusCode: 201 };
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
  @ApiInternalServerErrorResponse({
    description: 'Error while saving or deleting user or token',
    content: {
      'application/json': {
        examples: {
          refreshTokenSavedError: {
            summary: 'Error while saving refresh token',
            value: {
              message: 'Error while saving refresh token',
              error: 'Internal Server Error',
              statusCode: 500,
            },
          },
          refreshTokenDeletedError: {
            summary: 'Error while deleting refresh token',
            value: {
              message: 'Error while deleting refresh token',
              error: 'Internal Server Error',
              statusCode: 500,
            },
          },
        },
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
    @Res({ passthrough: true }) response: Response,
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

    if (res.message === 'Error while saving refresh token') {
      throw new InternalServerErrorException(res.message);
    }

    const token = res.access_token;
    const message = res.message;

    response.cookie('refresh_token', res.refresh_token, {
      httpOnly: true, // Prevents JS access
      secure: true, // HTTPS only
      sameSite: 'strict', // Prevents CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { token, message, statusCode: 200 };
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
  @ApiInternalServerErrorResponse({
    description: 'Error while saving or deleting user or token',
    content: {
      'application/json': {
        examples: {
          refreshTokenSavedError: {
            summary: 'Error while saving refresh token',
            value: {
              message: 'Error while saving refresh token',
              error: 'Internal Server Error',
              statusCode: 500,
            },
          },
          refreshTokenDeletedError: {
            summary: 'Error while deleting refresh token',
            value: {
              message: 'Error while deleting refresh token',
              error: 'Internal Server Error',
              statusCode: 500,
            },
          },
          userSavedError: {
            summary: 'Error while saving user',
            value: {
              message: 'Error while saving user',
              error: 'Internal Server Error',
              statusCode: 500,
            },
          },
        },
      },
    },
  })
  async googleAuthRedirect(
    @Res({ passthrough: true }) response: Response,
    @Req() req,
  ) {
    if (req.error) {
      return req.error;
    }
    const user = req.user;
    const token = user.access_token;
    const userId = user.userId;
    const isFirstLogin = user.isFirstLogin;

    response.cookie('refresh_token', user.refresh_token, {
      httpOnly: true, // Prevents JS access
      secure: true, // HTTPS only
      sameSite: 'strict', // Prevents CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return {
      message: 'User logged successfully',
      token,
      userId,
      isFirstLogin,
      statusCode: 200,
    };
  }

  @Roles(UserRole.USER)
  @Post('refresh')
  @ApiRoles(UserRole.USER)
  @ApiOperation({
    summary: 'Refresh JWT token',
    description:
      'This endpoint allows a user to refresh their JWT token using a valid refresh token. ' +
      'If the refresh token is valid, a new access token will be generated and returned. ' +
      'If the refresh token is invalid or expired, an error will be returned.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Token refreshed successfully' },
        token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvcmRhbiBEb2UiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMiwicm9sZSI6InVzZXIifQ.5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA',
        },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid refresh token' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error while deleting or saving refresh token',
    content: {
      'application/json': {
        examples: {
          refreshTokenSavedError: {
            summary: 'Error while saving refresh token',
            value: {
              message: 'Error while saving refresh token',
              error: 'Internal Server Error',
              statusCode: 500,
            },
          },
          refreshTokenDeletedError: {
            summary: 'Error while deleting refresh token',
            value: {
              message: 'Error while deleting refresh token',
              error: 'Internal Server Error',
              statusCode: 500,
            },
          },
        },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvcmRhbiBEb2UiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjI0MjYyMiwicm9sZSI6InVzZXIifQ.5mhBHqs5_DTLdINd9p5m7ZJ6XD0Xc55kIaCRY5r6HRA',
        },
      },
    },
  })
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @Body('refresh_token') refreshToken: string,
  ) {
    const user = await this.tokenService.validateRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { email: user.email, sub: user.userId, role: user.role };
    const accessToken = await this.tokenService.generateAccessToken(payload);
    const newRefreshToken =
      await this.tokenService.generateRefreshToken(payload);
    const tokenDeleted = await this.tokenService.deleteRefreshToken(
      user.userId as ObjectId,
    );
    if (!tokenDeleted) {
      throw new InternalServerErrorException(
        'Error while deleting refresh token',
      );
    }
    const tokenSaved = await this.tokenService.saveRefreshToken(
      user.userId as ObjectId,
      newRefreshToken,
    );
    if (!tokenSaved) {
      throw new InternalServerErrorException(
        'Error while saving refresh token',
      );
    }

    response.cookie('refresh_token', user.refresh_token, {
      httpOnly: true, // Prevents JS access
      secure: true, // HTTPS only
      sameSite: 'strict', // Prevents CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      message: 'Token refreshed successfully',
      token: accessToken,
      statusCode: 200,
    };
  }

  @Roles(UserRole.USER)
  @Post('logout')
  @ApiRoles(UserRole.USER)
  @ApiOperation({
    summary: 'Logout a user',
    description:
      'This endpoint allows a user to log out of the system. ' +
      'It deletes the refresh token associated with the user, effectively logging them out.',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User logged out successfully' },
        token: { type: 'null' },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error while deleting refresh token',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Error while deleting refresh token',
        },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: '60d5ec49f1b2c8a3d4e8b456' },
      },
    },
  })
  async logout(@Body('userId') userId: string) {
    const tokenDeleted = await this.tokenService.deleteRefreshToken(
      userId as unknown as ObjectId,
    );
    if (!tokenDeleted) {
      throw new InternalServerErrorException(
        'Error while deleting refresh token',
      );
    }

    return {
      message: 'User logged out successfully',
      token: null,
      statusCode: 200,
    };
  }

  @Roles(UserRole.ADMIN)
  @Post('deleteToken')
  @ApiRoles(UserRole.ADMIN)
  @ApiOperation({
    summary: "Delete a user's refresh token",
    description:
      "This endpoint allows an admin to delete a user's refresh token. " +
      'It effectively logs the user out of the system by invalidating their refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token deleted successfully.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Token deleted successfully' },
        token: { type: 'null' },
        statusCode: { type: 'number', example: 200 },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error while deleting refresh token',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Error while deleting refresh token',
        },
        error: { type: 'string', example: 'Internal Server Error' },
        statusCode: { type: 'number', example: 500 },
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: '60d5ec49f1b2c8a3d4e8b456' },
      },
    },
  })
  async deleteToken(@Body('userId') userId: string) {
    const tokenDeleted = await this.tokenService.deleteRefreshToken(
      userId as unknown as ObjectId,
    );
    if (!tokenDeleted) {
      throw new InternalServerErrorException(
        'Error while deleting refresh token',
      );
    }

    return {
      message: 'Token deleted successfully',
      token: null,
      statusCode: 200,
    };
  }
}
