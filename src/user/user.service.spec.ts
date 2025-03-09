import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { Model } from 'mongoose';
import { UpdatePasswordDto } from './dto/update-password.dto';

const mockUser = {
  email: 'Geralt@rivia.com',
  name: 'Geralt',
  lastname: 'z Rivii',
  password: 'Zaraza123',
  favourites: [1, 2, 3],
};

const mockUserModel = {
  findOne: jest.fn().mockImplementation(({ email }) =>
    email === mockUser.email ? { exec: jest.fn().mockResolvedValue(mockUser) } : { exec: jest.fn().mockResolvedValue(null) }
  ),
  find: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue([mockUser]),
  })),
  findOneAndUpdate: jest.fn().mockImplementation((query, update) => {
    const updatedUser = { ...mockUser, ...update };

    if (update.$push && update.$push.favourites) {
      updatedUser.favourites.push(update.$push.favourites);
    }
    if (update.$pull && update.$pull.favourites) {
      updatedUser.favourites = updatedUser.favourites.filter(fav => fav !== update.$pull.favourites);
    }

    return {
      exec: jest.fn().mockResolvedValue(updatedUser),  
    };
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
    const updatedUser = await service.updateUserName('Geralt@rivia.com', 'Rzeznik');
    expect(updatedUser.name).toBe('Rzeznik');
    expect(model.findOneAndUpdate).toHaveBeenCalledWith({ email: 'Geralt@rivia.com' }, { name: 'Rzeznik' }, { new: true });
  });

  it('should update user lastname', async () => {
    const updatedUser = await service.updateUserLastname('Geralt@rivia.com', 'Z blaviken');
    expect(updatedUser.lastname).toBe('Z blaviken');
  });

  it('should update user password', async () => {
    const updatePasswordDto: UpdatePasswordDto = {
      password: 'Yennefer123!',
    };
  
    const updatedUser = await service.updateUserPassword('Geralt@rivia.com', updatePasswordDto);
  
    expect(updatedUser.password).not.toBe('Zaraza123');
    expect(updatedUser.password).toBeDefined();
  });

  it('should return true if favourite exists', async () => {
    const exists = await service.isFavouriteExists('Geralt@rivia.com', 2);
    expect(exists).toBe(true);
  });

  it('should return false if favourite does not exist', async () => {
    const exists = await service.isFavouriteExists('Geralt@rivia.com', 99);
    expect(exists).toBe(false);
  });

  it('should add favourite', async () => {
    const updatedUser = await service.addFavourite('Geralt@rivia.com', 99);
    expect(updatedUser.favourites).toContain(99);
  });

  it('should remove favourite', async () => {
    const updatedUser = await service.removeFavourite('Geralt@rivia.com', 2);
    expect(updatedUser.favourites).not.toContain(2);
  });

});
