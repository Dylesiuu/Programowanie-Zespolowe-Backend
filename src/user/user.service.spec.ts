import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { Model } from 'mongoose';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

const mockUser = {
  email: 'Geralt@rivia.com',
  name: 'Geralt',
  lastname: 'z Rivii',
  password: 'Zaraza123',
  favourites: [1, 2],
  traits: [
    { tagId: 1, priority: 1, name: 'Warrior' },
    { tagId: 2, priority: 2, name: 'Strategist' },
  ],
};

const mockUserModel = {
  findOne: jest.fn().mockImplementation(({ email }) =>
    email === 'Geralt@rivia.com' 
      ? Promise.resolve({
                       ...mockUser , 
                       save: jest.fn().mockImplementation(function () {return Promise.resolve(this);}) 
                      })  
      : Promise.resolve(null)
  ),

  find: jest.fn().mockResolvedValue([mockUser]),

  findOneAndUpdate: jest.fn().mockImplementation((query, update) => {
    if (query.email !== mockUser.email) return Promise.resolve(null);

    if (update.password) {
      mockUser.password = update.password;
    }


    if (update.$set?.traits) {
      mockUser.traits = [...update.$set.traits];
    }
    if (update.$pull?.traits) {
      const tagIdToRemove = update.$pull.traits.tagId;
      mockUser.traits = mockUser.traits.filter(trait => trait.tagId !== tagIdToRemove);
    }

    if (update.$set?.favourites) {
      mockUser.favourites = [...update.$set.favourites];
    }
    


    return Promise.resolve(mockUser);
  }),
};



describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name),
           useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by email', async () => {
    const user = await service.findByEmail('Geralt@rivia.com');
    expect(user).toMatchObject(mockUser);
    expect(model.findOne).toHaveBeenCalledWith({ email: 'Geralt@rivia.com' });
  });

  it('should return null if user not found', async () => {
    const user = await service.findByEmail('Ciri@rivia.com');
    expect(user).toBeNull();
  });

  it('should return all users', async () => {
    const users = await service.findAll();
    expect(users).toMatchObject([mockUser]);
    expect(model.find).toHaveBeenCalled();
  });

  it('should update user name', async () => {
    const updatedUser = await service.updateUserName('Geralt@rivia.com', 'Rzeznik');
    expect(updatedUser.name).toBe('Rzeznik');
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
    const isPasswordCorrect = await bcrypt.compare('Yennefer123!', updatedUser.password);
    expect(isPasswordCorrect).toBe(true);
    expect(updatedUser.password).toBeDefined();
  });

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
    const updatedUser = await service.addTrait('Geralt@rivia.com', [newTrait]);
    expect(updatedUser.traits).toContainEqual(newTrait);
  
    expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'Geralt@rivia.com' },
      { $set: { traits: [...mockUser.traits.filter(t => t.tagId !== newTrait.tagId), newTrait] } },
      { new: true }
    );
  });

  it('should add 2 trait', async () => {
    const newTraits = [
      { tagId: 3, priority: 1, name: 'Mage' },
      { tagId: 4, priority: 2, name: 'Alchemist' },
    ];
    const updatedUser = await service.addTrait('Geralt@rivia.com', newTraits);
    expect(updatedUser.traits).toContainEqual(newTraits[0]);
    expect(updatedUser.traits).toContainEqual(newTraits[1]);
  
    expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'Geralt@rivia.com' },
      { $set: { traits: expect.arrayContaining([...mockUser.traits, ...newTraits]) } },
      { new: true }
    );
  });

  it('should remove trait', async () => {
    const expectedTraits = [
      { tagId: 2, priority: 2, name: 'Strategist' },
      { tagId: 3, priority: 1, name: 'Mage' },
      { tagId: 4, priority: 2, name: 'Alchemist' },
    ];
    const updatedUser = await service.removeTrait('Geralt@rivia.com', [{ tagId: 1 }]); 
    expect(updatedUser.traits).not.toContainEqual(expect.objectContaining({ tagId: 1 }));
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'Geralt@rivia.com' },
      { $set: { traits: expectedTraits } },  
      { new: true }
    );
  });

  it('shuld add favourite', async () => {
    const newFavourite = { "favourites": [3,4]};
    const updateUser = await service.addFavourite('Geralt@rivia.com', newFavourite.favourites);

    expect(updateUser.favourites).toContainEqual(3);
    expect(updateUser.favourites).toContainEqual(4);

    expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email : 'Geralt@rivia.com'},
      { $set: { favourites: expect.arrayContaining([...mockUser.favourites, ...newFavourite.favourites]) } },
      { new: true }
    );
  });

  it('should remove favourite', async () => {
    const newFavourites = [1, 2];
    const updateUser = await service.removeFavourite('Geralt@rivia.com', newFavourites);
    expect(updateUser.favourites).not.toContainEqual(1);
    expect(updateUser.favourites).not.toContainEqual(2);

    expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'Geralt@rivia.com' },
      expect.objectContaining({
        $set: expect.objectContaining({favourites: expect.not.arrayContaining(newFavourites)}),
      }),
      { new: true }
    );
  });

});
