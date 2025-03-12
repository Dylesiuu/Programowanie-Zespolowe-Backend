import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuth } from './google.auth';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';

describe('GoogleAuth', () => {
  let googleAuth: GoogleAuth;
  const userModel = mock<Model<UserDocument>>();
  const jwtService = mock<JwtService>();

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
          provide: JwtService,
          useValue: jwtService,
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
    const user = { email: 'john.doe@example.com', _id: '123' };
    userModel.findOne.mockResolvedValue(user);
    jwtService.sign.mockReturnValue('test-token');

    const done = jest.fn();
    await googleAuth.validate('accessToken', 'refreshToken', profile, done);

    expect(done.mock.calls[0][0]).toBe(null);
    expect(done.mock.calls[0][1]).toEqual({
      token: 'test-token',
      userId: user._id,
    });
  });

  it('should create a new user and return a token if the user does not exist', async () => {
    const profile = {
      name: { givenName: 'John', familyName: 'Doe' },
      emails: [{ value: 'john.doe@example.pl' }],
    };
    userModel.findOne.mockResolvedValue(null);

    const newUser = {
      save: jest
        .fn()
        .mockResolvedValue({ email: 'john.doe@example.pl', _id: '123' }),
      _id: '123',
    };
    userModel.create.mockReturnValue(newUser as any);

    jwtService.sign.mockReturnValue('test-token');

    const done = jest.fn();
    await googleAuth.validate('accessToken', 'refreshToken', profile, done);

    expect(done.mock.calls[0][0]).toBe(null);
    expect(done.mock.calls[0][1]).toEqual({
      token: 'test-token',
      userId: '123',
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
