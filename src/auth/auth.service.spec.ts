import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { mock } from 'jest-mock-extended';

describe('AuthService', () => {
  let service: AuthService;
  const userModel = mock<Model<UserDocument>>();
  const jwtService = mock<JwtService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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
    };

    const newUserDataDto = plainToInstance(CreateUserDto, newUserData);

    const errors = await validate(newUserDataDto);
    expect(errors.length).toBe(0);

    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue({
      ...newUserData,
      save: jest.fn().mockResolvedValue(newUserData),
    } as any);

    (jwtService.sign as jest.Mock).mockReturnValue('mocked-jwt-token');

    const res = await service.register(newUserDataDto);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: newUserData.email,
    });
    expect(userModel.create).toHaveBeenCalledWith({
      name: newUserData.name,
      lastname: newUserData.lastname,
      email: newUserData.email,
      password: expect.any(String),
    });

    expect(jwtService.sign).toHaveBeenCalledWith({
      email: newUserData.email,
      sub: undefined,
    });
    expect(res).toEqual({
      message: 'User registered successfully',
      token: 'mocked-jwt-token',
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

    userModel.findOne.mockResolvedValueOnce(null);
    userModel.create.mockResolvedValue({
      ...newUserData,
      save: jest.fn().mockResolvedValue(newUserData),
    } as any);

    (jwtService.sign as jest.Mock).mockReturnValue('mocked-jwt-token');

    await service.register(newUserDataDto);

    userModel.findOne.mockResolvedValueOnce(newUserData);

    const res = await service.register(newUserDataDto);

    expect(res).toEqual({
      message: 'User with this email already exists',
      token: null,
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

    userModel.findOne.mockResolvedValueOnce(null);
    userModel.create.mockResolvedValue({
      ...newUserData,
      password: hashedPassword,
      save: jest.fn().mockResolvedValue(newUserData),
    } as any);

    await service.register(newUserDataDto);

    userModel.findOne.mockResolvedValueOnce({
      ...newUserData,
      password: hashedPassword,
    } as any);

    const res = await service.login(newUserData.email, newUserData.password);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: newUserData.email,
    });

    expect(res.message).toEqual('User logged successfully');
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

    expect(res.message).toEqual('User does not exist');
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

    userModel.findOne.mockResolvedValueOnce(null);
    userModel.create.mockResolvedValue({
      ...newUserData,
      password: hashedPassword,
      save: jest.fn().mockResolvedValue(newUserData),
    } as any);

    await service.register(newUserDataDto);

    userModel.findOne.mockResolvedValueOnce({
      ...newUserData,
      password: hashedPassword,
    } as any);

    const res = await service.login(
      newUserData.email,
      'PaslO24523459282fnw82#',
    );

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: newUserData.email,
    });

    expect(res.message).toEqual('Bad password');
  });
});
