import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should not throw error with valid data', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

    const newUserDataDto = plainToInstance(CreateUserDto, newUserData);

    const errors = await validate(newUserDataDto);
    expect(errors.length).toBe(0);
  });

  it('should throw error with inccorect data', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email',
      password: 'haslO2452345923582fnw823',
    };

    const newUserDataDto = plainToInstance(CreateUserDto, newUserData);

    const errors = await validate(newUserDataDto);
    expect(errors.length).not.toBe(0);
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

    const res = await service.register(newUserDataDto);

    expect(res.message).toEqual('User registered successfully');
    expect(service.users[service.users.length - 1]).toHaveProperty(
      'email',
      newUserData.email,
    );

    const passMatch = await bcrypt.compare(
      newUserData.password,
      service.users[service.users.length - 1].password,
    );
    expect(passMatch).toBe(true);
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

    await service.register(newUserDataDto);

    const res = await service.register(newUserDataDto);

    expect(res.message).toEqual('User with this email already exists');
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

    await service.register(newUserDataDto);

    const res = await service.login(newUserData.email, newUserData.password);

    expect(res.message).toEqual('User logged successfully');
  });

  it('should not allow login of a non existing user', async () => {
    const newUserData = {
      name: 'name',
      lastname: 'lastName',
      email: 'email@gmail.com',
      password: 'haslO2452345923582fnw823#',
    };

    const res = await service.login(newUserData.email, newUserData.password);

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

    await service.register(newUserDataDto);

    const res = await service.login(
      newUserData.email,
      'PaslO24523459282fnw82#',
    );

    expect(res.message).toEqual('Bad password');
  });
});
