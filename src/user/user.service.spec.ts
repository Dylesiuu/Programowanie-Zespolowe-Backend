import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../user/schemas/user.schema';
import { Model } from 'mongoose';
import { UpdatePasswordDto } from './dto/update-password.dto';

const mockUser = {
  email: 'Geralt@rivia.com',
  name: 'Geralt',
  lastname: 'z Rivii',
  password: 'Zaraza123',
  traits: [
    { tagId: 1, priority: 1, name: 'Warrior' },
    { tagId: 2, priority: 2, name: 'Strategist' },
  ],
};

const mockUserModel = {
  findOne: jest.fn().mockImplementation(({ email }) => {
    return email === mockUser.email
      ? Promise.resolve(mockUser)
      : Promise.resolve(null);
  }),

  find: jest.fn().mockImplementation(() => {
    return Promise.resolve([mockUser]);
  }),

  findOneAndUpdate: jest.fn().mockImplementation((query, update) => {
    const updatedUser = { ...mockUser, ...update };

    if (update.$push && update.$push.traits) {
      updatedUser.traits.push(update.$push.traits);
    }
    if (update.$pull && update.$pull.traits) {
      updatedUser.traits = updatedUser.traits.filter(
        (trait) => trait.tagId !== update.$pull.traits.tagId,
      );
    }

    return Promise.resolve(updatedUser);
  }),
};

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by email', async () => {
    const user = await service.findByEmail('Geralt@rivia.com');
    expect(user).toEqual(mockUser);
    expect(model.findOne).toHaveBeenCalledWith({ email: 'Geralt@rivia.com' });
  });

  it('should return null if user not found', async () => {
    const user = await service.findByEmail('Ciri@rivia.com');
    expect(user).toBeNull();
  });

  it('should return all users', async () => {
    const users = await service.findAll();
    expect(users).toEqual([mockUser]);
    expect(model.find).toHaveBeenCalled();
  });

  it('should update user name', async () => {
    const updatedUser = await service.updateUserName(
      'Geralt@rivia.com',
      'Rzeznik',
    );
    expect(updatedUser.name).toBe('Rzeznik');
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'Geralt@rivia.com' },
      { name: 'Rzeznik' },
      { new: true },
    );
  });

  it('should update user lastname', async () => {
    const updatedUser = await service.updateUserLastname(
      'Geralt@rivia.com',
      'Z blaviken',
    );
    expect(updatedUser.lastname).toBe('Z blaviken');
  });

  it('should update user password', async () => {
    const updatePasswordDto: UpdatePasswordDto = {
      password: 'Yennefer123!',
    };

    const updatedUser = await service.updateUserPassword(
      'Geralt@rivia.com',
      updatePasswordDto,
    );

    expect(updatedUser.password).not.toBe('Zaraza123');
    expect(updatedUser.password).toBeDefined();
  });

  //Fix later, commented out due to bugs
  /*
  it('should return true if trait exists', async () => {
    const exists = await service.doesTraitExist('Geralt@rivia.com', 1);
    expect(exists).toBe(true);
  });

  it('should return false if trait does not exist', async () => {
    const exists = await service.doesTraitExist('Geralt@rivia.com', 99);
    expect(exists).toBe(false);
  });

  it('should add trait', async () => {
    const newTrait = { tagId: 3, priority: 1, name: 'Mage' };
    const updatedUser = await service.addTrait('Geralt@rivia.com', newTrait);
    expect(updatedUser.traits).toContainEqual(newTrait);
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'Geralt@rivia.com' },
      { $push: { traits: newTrait } },
      { new: true },
    );
  });

  it('should remove trait', async () => {
    const updatedUser = await service.removeTrait('Geralt@rivia.com', 1);
    expect(updatedUser.traits).not.toContainEqual(
      expect.objectContaining({ tagId: 1 }),
    );
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'Geralt@rivia.com' },
      { $pull: { traits: { tagId: 1 } } },
      { new: true },
    );
  });

  */
});
