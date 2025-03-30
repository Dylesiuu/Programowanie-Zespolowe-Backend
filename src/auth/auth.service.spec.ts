import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { mock } from 'jest-mock-extended';
import { UserRole } from './roles/user-role.enum';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;
  const userModel = mock<Model<UserDocument>>();
  //const jwtService = mock<JwtService>();
  const tokenService = mock<TokenService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        // {
        //   provide: JwtService,
        //   useValue: jwtService,
        // },
        {
          provide: TokenService,
          useValue: tokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user successfully', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
      role: UserRole.USER,
    };

    const newUserDataDto = plainToInstance(CreateUserDto, newUserData);

    const errors = await validate(newUserDataDto);
    expect(errors.length).toBe(0);

    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue({
      ...newUserData,
      _id: '123',
      save: jest.fn().mockResolvedValue({
        ...newUserData,
        _id: '123',
      }),
    } as any);

    //(jwtService.sign as jest.Mock).mockReturnValue('mocked-jwt-token');
    tokenService.generateAccessToken.mockResolvedValue('mocked-jwt-token');
    tokenService.generateRefreshToken.mockResolvedValue('mocked-jwt-token');

    const res = await service.register(newUserDataDto);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: newUserData.email,
    });
    expect(userModel.create).toHaveBeenCalledWith({
      name: newUserData.name,
      lastname: newUserData.lastname,
      email: newUserData.email,
      password: expect.not.stringMatching(newUserData.password),
      role: UserRole.USER,
    });

    expect(tokenService.generateAccessToken).toHaveBeenCalledWith({
      email: newUserData.email,
      sub: '123',
      role: UserRole.USER,
    });

    expect(tokenService.generateRefreshToken).toHaveBeenCalledWith({
      email: newUserData.email,
      sub: '123',
      role: UserRole.USER,
    });

    expect(res).toEqual({
      message: 'User registered successfully',
      access_token: 'mocked-jwt-token',
      refresh_token: 'mocked-jwt-token',
      userId: '123',
    });
  });

  it('should not allow registration of an already existing user', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

    const newUserDataDto = plainToInstance(CreateUserDto, newUserData);

    const errors = await validate(newUserDataDto);
    expect(errors.length).toBe(0);

    //(jwtService.sign as jest.Mock).mockReturnValue('mocked-jwt-token');
    tokenService.generateAccessToken.mockResolvedValue('mocked-jwt-token');
    tokenService.generateRefreshToken.mockResolvedValue('mocked-jwt-token');

    userModel.findOne.mockResolvedValueOnce({
      ...newUserData,
      _id: '123',
      role: UserRole.USER,
    } as any);

    const res = await service.register(newUserDataDto);

    expect(res).toEqual({
      message: 'User with this email already exists',
      access_token: null,
      refresh_token: null,
      userId: null,
    });
  });

  it('should login a existing user successfully', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

    const newUserDataDto = plainToInstance(CreateUserDto, newUserData);

    const errors = await validate(newUserDataDto);
    expect(errors.length).toBe(0);

    const hashedPassword = await bcrypt.hash(newUserData.password, 12);

    userModel.findOne.mockResolvedValueOnce({
      ...newUserData,
      password: hashedPassword,
      _id: '123',
      role: UserRole.USER,
    } as any);

    //(jwtService.sign as jest.Mock).mockReturnValue('mocked-jwt-token');
    tokenService.generateAccessToken.mockResolvedValue('mocked-jwt-token');
    tokenService.generateRefreshToken.mockResolvedValue('mocked-jwt-token');

    const res = await service.login(newUserData.email, newUserData.password);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: newUserData.email,
    });

    expect(res).toEqual({
      message: 'User logged successfully',
      access_token: 'mocked-jwt-token',
      refresh_token: 'mocked-jwt-token',
      userId: '123',
    });
  });

  it('should not allow login of a non existing user', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

    userModel.findOne.mockResolvedValueOnce(null);

    const res = await service.login(newUserData.email, newUserData.password);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: newUserData.email,
    });

    expect(res).toEqual({
      message: 'User does not exist',
      access_token: null,
      refresh_token: null,
      userId: null,
    });
  });

  it('should not allow login with wrong password', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

    const newUserDataDto = plainToInstance(CreateUserDto, newUserData);

    const errors = await validate(newUserDataDto);
    expect(errors.length).toBe(0);

    const hashedPassword = await bcrypt.hash(newUserData.password, 12);

    userModel.findOne.mockResolvedValueOnce({
      ...newUserData,
      password: hashedPassword,
      _id: '123',
      role: UserRole.USER,
    } as any);

    const res = await service.login(
      newUserData.email,
      'PaslO24523459282fnw82#',
    );

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: newUserData.email,
    });

    expect(res).toEqual({
      message: 'Bad password',
      access_token: null,
      refresh_token: null,
      userId: null,
    });
  });
});
