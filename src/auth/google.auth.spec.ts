import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuth } from './google.auth';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import { TokenService } from './token.service';
import { UserRole } from './roles/user-role.enum';

describe('GoogleAuth', () => {
  let googleAuth: GoogleAuth;
  const userModel = mock<Model<UserDocument>>();
  const tokenService = mock<TokenService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleAuth,
        ConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'GOOGLE_CLIENT_ID':
                  return 'test-client-id';
                case 'GOOGLE_CLIENT_SECRET':
                  return 'test-client-secret';
                case 'GOOGLE_CALLBACK_URL':
                  return 'http://localhost:3000/auth/google/callback';
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        {
          provide: TokenService,
          useValue: tokenService,
        },
      ],
    }).compile();

    googleAuth = module.get<GoogleAuth>(GoogleAuth);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token if the user exists', async () => {
    const profile = {
      name: { givenName: 'John', familyName: 'Doe' },
      emails: [{ value: 'john.doe@example.com' }],
    };
    const user = {
      email: 'john.doe@example.com',
      _id: '123',
      role: UserRole.USER,
    };
    userModel.findOne.mockResolvedValue(user);
    tokenService.generateAccessToken.mockResolvedValue('test-token');
    tokenService.generateRefreshToken.mockResolvedValue('test-token');
    tokenService.saveRefreshToken.mockResolvedValue(true);
    tokenService.deleteRefreshToken.mockResolvedValue(true);

    const done = jest.fn();
    await googleAuth.validate('accessToken', 'refreshToken', profile, done);

    expect(done.mock.calls[0][0]).toBe(null);
    expect(done.mock.calls[0][1]).toEqual({
      access_token: 'test-token',
      refresh_token: 'test-token',
      userId: user._id,
      isFirstLogin: false,
    });
  });

  it('should create a new user and return a token if the user does not exist', async () => {
    const profile = {
      name: { givenName: 'John', familyName: 'Doe' },
      emails: [{ value: 'john.doe@example.pl' }],
    };
    userModel.findOne.mockResolvedValue(null);

    const newUser = {
      save: jest.fn().mockResolvedValue({
        email: 'john.doe@example.pl',
        _id: '123',
        password: 'google-oauth',
        name: profile.name.givenName,
        lastname: profile.name.familyName,
        role: UserRole.USER,
      }),
      email: 'john.doe@example.pl',
      _id: '123',
      password: 'google-oauth',
      name: profile.name.givenName,
      lastname: profile.name.familyName,
      role: UserRole.USER,
    };
    userModel.create.mockResolvedValue(newUser as any);

    tokenService.generateAccessToken.mockResolvedValue('test-token');
    tokenService.generateRefreshToken.mockResolvedValue('test-token');
    tokenService.saveRefreshToken.mockResolvedValue(true);
    tokenService.deleteRefreshToken.mockResolvedValue(true);

    const done = jest.fn();
    await googleAuth.validate('accessToken', 'refreshToken', profile, done);

    expect(done.mock.calls[0][0]).toBe(null);
    expect(done.mock.calls[0][1]).toEqual({
      access_token: 'test-token',
      refresh_token: 'test-token',
      userId: '123',
      isFirstLogin: true,
    });
  });

  it('should handle internal server errors and call done with an error', async () => {
    const profile = {
      name: { givenName: 'John', familyName: 'Doe' },
      emails: [{ value: 'john.doe@example.com' }],
    };

    userModel.findOne.mockRejectedValue(
      new InternalServerErrorException('Internal server error'),
    );

    const done = jest.fn();
    await googleAuth.validate('accessToken', 'refreshToken', profile, done);

    expect(done.mock.calls[0][0]).toBeInstanceOf(InternalServerErrorException);
    expect(done.mock.calls[0][0].message).toBe('Internal server error');
    expect(done.mock.calls[0][1]).toBe(false);
  });
});
