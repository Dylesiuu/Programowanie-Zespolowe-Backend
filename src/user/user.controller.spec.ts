import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user', () => {
    const user = controller.getUser('Jan');
    expect(user).toEqual({ id: 1, name: 'Jan', tags: ['tag1', 'tag2'] });
  });

  it('should throw error if user not found', () => {
    expect(() => controller.getUser('Tomasz')).toThrow('Not Found');
  });
});
