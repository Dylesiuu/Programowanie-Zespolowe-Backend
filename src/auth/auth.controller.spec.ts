import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';

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
    const newUserData = {name: 'name', lastName: 'lastName', email: 'email', password: 'password'};

    const res = await controller.register(newUserData.name, newUserData.lastName, newUserData.email, newUserData.password);

    expect(res).toHaveProperty('message', 'User registered successfully');
  });
+
  it('should throw error if user already exists', async () =>
  {
    const newUserData = {name: 'name', lastName: 'lastName', email: 'email', password: 'password'};

    await controller.register(newUserData.name, newUserData.lastName, newUserData.email, newUserData.password);


    await expect(controller.register(newUserData.name, newUserData.lastName, newUserData.email, newUserData.password)).rejects.toThrow(new ConflictException('User with this email already exists'));

  });
});
