import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

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
    const newUserData = {email: 'email@email.com', password: 'password'};

    const res = await service.register(newUserData.email, newUserData.password);

    expect(res.message).toEqual('User registered successfully');
    expect(service.users[service.users.length - 1]).toHaveProperty('email', newUserData.email);

    const passMatch = await bcrypt.compare(newUserData.password, service.users[service.users.length - 1].password);
    expect(passMatch).toBe(true);
  });

  it('should not allow registration of an already existing user', async () =>
  {
    const newUserData = {email: 'email@email.com', password: 'password'};
    await service.register(newUserData.email, newUserData.password);
    const res = await service.register(newUserData.email, newUserData.password);

    expect(res.message).toEqual('User with this email already exists');
  });
});
