import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user by name', () => {
    const user = service.getUser('Jan');
    expect(user).toEqual({ id: 1, name: 'Jan', tags: ['tag1', 'tag2'] });
  });

  it('should return undefined if user not found', () => {
    const user = service.getUser('Tomasz');
    expect(user).toBeUndefined();
  });
});
