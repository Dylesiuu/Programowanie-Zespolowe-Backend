import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

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

  it('should register a new user successfully', async () =>
  {
    const newUserData: CreateUserDto = {
      name: 'name',
      lastname: 'lastName',
      email: 'email',
      password: 'haslO2452345923582fnw823',
    };

    const res = await service.register(newUserData);


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

  it('should not allow registration of an already existing user', async () =>
  {
    const newUserData: CreateUserDto = {
      name: 'name',
      lastname: 'lastName',
      email: 'email',
      password: 'haslO2452345923582fnw823',
    };
    await service.register(newUserData);

    const res = await service.register(newUserData);

    expect(res.message).toEqual('User with this email already exists');
  });
});
