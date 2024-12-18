import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Console } from 'console';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
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

    const res = await controller.register(newUserDataDto);

    expect(res).toHaveProperty('message', 'User registered successfully');
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

    await controller.register(newUserDataDto);

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

    await controller.register(newUserDataDto);

    const res = await controller.login(newUserData.email, newUserData.password);

    console.log(res);

    expect(res).toHaveProperty('message', 'User logged successfully');
  });

  it('should throw error if user does not exists', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

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

    await controller.register(newUserDataDto);

    await expect(
      controller.login(newUserData.email, 'PaslO2452345923582fnw823$'),
    ).rejects.toThrow(new ConflictException('Bad password'));
  });
});
