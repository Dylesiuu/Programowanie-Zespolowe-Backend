import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

const Id1 = new MongooseSchema.Types.ObjectId("65f8d3a7b9c1d2e0f6a4b5c6");
const Id2 = new MongooseSchema.Types.ObjectId("65f8d3a7b9c1d2e0f6a4b5c7");
const Id3 = new MongooseSchema.Types.ObjectId("65f8d3a7b9c1d2e0f6a4b7c6");
const Id4 = new MongooseSchema.Types.ObjectId("65f8d3a7b9c1d2e0f6a901c6");
const Id5 = new MongooseSchema.Types.ObjectId("65f8d3a7b9c1d2e0a6a901c7");

const mockUser = {
  email: 'Geralt@rivia.com',
  name: 'Geralt',
  lastname: 'z Rivii',
  password: 'Zaraza123',
  favourites: [Id1, Id2],
  traits: [Id1, Id2],
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
    const exists = await service.doesTraitExist('Geralt@rivia.com', Id1);
    expect(exists).toBe(true);
  });

  it('should return false if trait does not exist', async () => {
    const exists = await service.doesTraitExist('Geralt@rivia.com', Id5);
    expect(exists).toBe(false);
  });

  it('should add trait', async () => {
    const newTrait = [Id3];
    const updatedUser = await service.addTrait('Geralt@rivia.com', [Id3]);
    expect(updatedUser.traits).toContainEqual(Id3);
  
    expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'Geralt@rivia.com' },
      { $set: { traits: expect.arrayContaining([...mockUser.traits, ...newTrait]) } },
      { new: true }
    );
  });

  it('should add 2 trait', async () => {
    const updatedUser = await service.addTrait('Geralt@rivia.com', [Id3, Id4]);
    expect(updatedUser.traits).toContainEqual(Id3);
    expect(updatedUser.traits).toContainEqual(Id4);
  
    expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'Geralt@rivia.com' },
      { $set: { traits: expect.arrayContaining([...mockUser.traits, ...[Id3, Id4]]) } },
      { new: true }
    );
  });

  it('should remove trait', async () => {
    const expectedTraits = [Id2, Id3, Id4];
    const updatedUser = await service.removeTrait('Geralt@rivia.com', [Id1 ]); 
    expect(updatedUser.traits).not.toContainEqual(expect.objectContaining(Id1 ));
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'Geralt@rivia.com' },
      { $set: { traits: expectedTraits } },  
      { new: true }
    );
  });

  it('shuld add favourite', async () => {
    const newFavourite = { "favourites": [Id3, Id4]};
    const updateUser = await service.addFavourite('Geralt@rivia.com', newFavourite.favourites);

    expect(updateUser.favourites).toContainEqual(Id3);
    expect(updateUser.favourites).toContainEqual(Id4);

    expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email : 'Geralt@rivia.com'},
      { $set: { favourites: expect.arrayContaining([...mockUser.favourites, ...newFavourite.favourites]) } },
      { new: true }
    );
  });

  it('should remove favourite', async () => {
    const newFavourites = [Id3, Id4];
    const updateUser = await service.removeFavourite('Geralt@rivia.com', newFavourites);
    expect(updateUser.favourites).not.toContainEqual(Id3);
    expect(updateUser.favourites).not.toContainEqual(Id4);

    expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'Geralt@rivia.com' },
      expect.objectContaining({
        $set: expect.objectContaining({favourites: expect.not.arrayContaining(newFavourites)}),
      }),
      { new: true }
    );
  });

});


