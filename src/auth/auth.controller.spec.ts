import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should successfully register a new user', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

    const newUserDataDto = plainToInstance(CreateUserDto, newUserData);

    const errors = await validate(newUserDataDto);
    expect(errors.length).toBe(0);

    jest.spyOn(authService, 'register').mockResolvedValue({
      message: 'User registered successfully',
      token: 'mocked-jwt-token',
    });

    const res = await controller.register(newUserDataDto);

    expect(res).toEqual({
      message: 'User registered successfully',
      token: 'mocked-jwt-token',
    });
    expect(authService.register).toHaveBeenCalledWith(newUserDataDto);
  });

  it('should throw error if user already exists', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

    const newUserDataDto = plainToInstance(CreateUserDto, newUserData);

    const errors = await validate(newUserDataDto);
    expect(errors.length).toBe(0);

    jest.spyOn(authService, 'register').mockResolvedValueOnce({
      message: 'User with this email already exists',
      token: null,
    });

    await expect(controller.register(newUserDataDto)).rejects.toThrow(
      new ConflictException('User with this email already exists'),
    );
  });

  it('should successfully login a existing user', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

    const newUserDataDto = plainToInstance(CreateUserDto, newUserData);

    const errors = await validate(newUserDataDto);
    expect(errors.length).toBe(0);

    jest.spyOn(authService, 'login').mockResolvedValue({
      message: 'User logged successfully',
      token: 'mocked-jwt-token',
    });

    const res = await controller.login(newUserData.email, newUserData.password);

    expect(res).toEqual({
      message: 'User logged successfully',
      token: 'mocked-jwt-token',
    });
    expect(authService.login).toHaveBeenCalledWith(
      newUserData.email,
      newUserData.password,
    );
  });

  it('should throw error if user does not exists', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

    jest
      .spyOn(authService, 'login')
      .mockResolvedValue({ message: 'User does not exist', token: null });

    await expect(
      controller.login(newUserData.email, newUserData.password),
    ).rejects.toThrow(new UnauthorizedException('User does not exist'));
  });

  it('should throw error if password does not match', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

    const newUserDataDto = plainToInstance(CreateUserDto, newUserData);

    const errors = await validate(newUserDataDto);
    expect(errors.length).toBe(0);

    jest
      .spyOn(authService, 'login')
      .mockResolvedValue({ message: 'Bad password', token: null });

    await expect(
      controller.login(newUserData.email, 'PaslO2452345923582fnw823$'),
    ).rejects.toThrow(new ConflictException('Bad password'));
  });
});
