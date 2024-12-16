import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  it('should successfully register a new user', async () =>
  {
    const newUserData: CreateUserDto = {
      name: 'name',
      lastname: 'lastName',
      email: 'email',
      password: 'haslO2452345923582fnw823',
    };

    const res = await controller.register(newUserData);

    expect(res).toHaveProperty('message', 'User registered successfully');
  });

  it('should throw error if user already exists', async () =>
  {
    const newUserData: CreateUserDto = {
      name: 'name',
      lastname: 'lastName',
      email: 'email',
      password: 'haslO2452345923582fnw823',
    };

    await controller.register(newUserData);

    await expect(controller.register(newUserData)).rejects.toThrow(
      new ConflictException('User with this email already exists'),
    );
  });
});
