import { Test, TestingModule } from '@nestjs/testing';
import { ScrollingService } from './scrolling.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Pet } from './schema/pet.schema';
import { mock } from 'jest-mock-extended';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  UserTrait,
  UserTraitDocument,
} from '../traits/schemas/userTrait.schema';
import {
  AnimalTraits,
  AnimalTraitsDocument,
} from '../traits/schemas/animalTrait.schema';

const mockPet = [
  {
    id: 0,
    name: 'Spongebob',
    age: '1 rok',
    discribtion: 'pochodzi z warszawy',
    gender: 'Pies',
    location: 'Warszawa',
    shelter: 'Schronisko na Paluchu',
    traits: [1, 2],
    image:
      'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
  },
  {
    id: 1,
    name: 'Pomelo',
    age: '2 lata',
    discribtion: 'pochodzi z torunia',
    gender: 'Suka',
    location: 'Toruń',
    shelter: 'Schronisko dla zwierząt w Toruniu',
    traits: [3],
    image:
      'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
  },
  {
    id: 2,
    name: 'Spongebob',
    age: '4 lata',
    discribtion: 'pochodzi z bydgoszczy',
    gender: 'Pies',
    location: 'Bydgoszcz',
    shelter: 'Schronisko dla Zwierząt w Bydgoszczy',
    traits: [1, 4],
    image:
      'https://dogshome.com/wp-content/uploads/animalimages//1139184/556697c795ff443c8969ac1c81f9a95a-1728272579-1728272583_other.jpg',
  },
];

const mockUsers = [
  {
    _id: new ObjectId('65f4c8e9f0a5a4d3b4a12345'),
    name: 'Jan',
    lastname: 'Kowalski',
    email: 'jan.kowalski@example.com',
    password: 'securepassword123',
    favourites: [0, 2],
    traits: [1],
  },
  {
    _id: new ObjectId('65f4c8e9f0a5a4d3b4a67890'),
    name: 'Anna',
    lastname: 'Nowak',
    email: 'anna.nowak@example.com',
    password: 'strongpass456',
    favourites: [1],
    traits: [2],
  },
  {
    _id: new ObjectId('65f4c8e9f0a5a4d3b4a54321'),
    name: 'Piotr',
    lastname: 'Wiśniewski',
    email: 'piotr.wisniewski@example.com',
    password: 'mypassword789',
    favourites: [0, 1, 2],
    traits: [2, 3],
  },
];

const mockUserTraits = [
  {
    tagId: 1,
    name: 'Trait 1',
    animalsTraits: [1, 2, 4],
  },
  {
    tagId: 2,
    name: 'Trait 2',
    animalsTraits: [3, 5, 7],
  },
  {
    tagId: 3,
    name: 'Trait 3',
    animalsTraits: [6, 8, 9],
  },
];

const mockAnimalTraits = [
  {
    tagId: 1,
    name: 'Trait 1',
    priority: 1,
  },
  {
    tagId: 2,
    name: 'Trait 2',
    priority: 2,
  },
  {
    tagId: 3,
    name: 'Trait 3',
    priority: 3,
  },
  {
    tagId: 4,
    name: 'Trait 4',
    priority: 4,
  },
];

const mockPetModel = {
  findOne: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue(null),
  })),
  find: jest.fn().mockImplementation(() => ({
    exec: jest.fn().mockResolvedValue([]),
  })),
};

describe('ScrollingService', () => {
  let service: ScrollingService;
  let model: Model<Pet>;
  const userModel = mock<Model<UserDocument>>();
  const userTraitsModel = mock<Model<UserTraitDocument>>();
  const animalTraitsModel = mock<Model<AnimalTraitsDocument>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrollingService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        { provide: getModelToken('Pet'), useValue: mockPetModel },
        { provide: getModelToken(UserTrait.name), useValue: userTraitsModel },
        {
          provide: getModelToken(AnimalTraits.name),
          useValue: animalTraitsModel,
        },
      ],
    }).compile();

    service = module.get<ScrollingService>(ScrollingService);
    model = module.get<Model<Pet>>(getModelToken(Pet.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // test 2: zwracanie danych
  it('should return a pet by id', async () => {
    const mockQuery = {
      exec: jest.fn().mockResolvedValue(mockPet[1]),
    };

    jest.spyOn(model, 'findOne').mockReturnValue(mockQuery as any);

    const result = await service.getPetbyIndex('1');
    expect(result).toEqual(mockPet[1]);
    expect(model.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  //test 3: zły indeks(wartosc poza zakresem)
  it('return error for id out of range', async () => {
    const result = await service.getPetbyIndex('-1');
    expect(result).toEqual({ error: 'Index is Invalid.' });
  });

  //test 4: zły indeks(wartosc poza zakresem)
  it('return rerror for index not in table', async () => {
    const mockQuery = {
      exec: jest.fn().mockResolvedValue(null),
    };
    jest.spyOn(model, 'findOne').mockReturnValue(mockQuery as any);

    const result = await service.getPetbyIndex('5');
    expect(result).toEqual({ error: 'Pet not found.' });
  });

  //test 5: zły indeks(nie liczba)
  it('return error for index not a number', async () => {
    const result = await service.getPetbyIndex('aa');
    expect(result).toEqual({ error: 'Index is Invalid.' });
  });

  // test 6: zwracanie danych z nazwy
  it('return item from table of name', async () => {
    jest.spyOn(model, 'find').mockResolvedValue([mockPet[1]]);

    const result = await service.getPetbyName('Pomelo');
    expect(result).toEqual([mockPet[1]]);
  });

  //test 7: zła nazwa
  it('return error cause name not found', async () => {
    jest.spyOn(model, 'find').mockResolvedValue([]);
    const result = await service.getPetbyName('5321');
    expect(result).toEqual({ error: 'Pet with that name not found.' });
  });

  //test 8: wiecej niz jeden pet z takim imieniem
  it('return more than one pet by name', async () => {
    jest.spyOn(model, 'find').mockResolvedValue([mockPet[0], mockPet[2]]);
    const result = await service.getPetbyName('Spongebob');
    expect(result).toEqual([mockPet[0], mockPet[2]]);
  });

  //test 9: zwracanie całej tablicy funkcją getAll
  it('return table by getAll function', async () => {
    jest.spyOn(model, 'find').mockResolvedValue(mockPet);

    const result = await service.getAll();
    expect(result).toEqual(mockPet);
  });

  it('should return matched animals if user is found', async () => {
    jest.spyOn(model, 'find').mockResolvedValue(mockPet);
    userModel.findById.mockResolvedValue(mockUsers[2]);
    userTraitsModel.find.mockResolvedValue(mockUserTraits);
    animalTraitsModel.find.mockResolvedValue(mockAnimalTraits);

    const res = await service.match(mockUsers[2]._id);
    expect(res).toEqual({
      matchedAnimals: expect.any(Array),
      userWithTraits: expect.any(Object),
    });
  });

  // it('shuld return message if no pets found', async () => {
  //   jest.spyOn(model, 'find').mockResolvedValue([]);
  //   userModel.findById.mockResolvedValue(mockUsers[2]);

  //   const res = await service.match(mockUsers[2]._id);
  //   expect(res).toEqual({ message: 'No pets found.' });
  // });

  // it('should return message if user not found', async () => {
  //   jest.spyOn(model, 'find').mockResolvedValue(mockPet);
  //   userModel.findById.mockResolvedValue(null);

  //   const res = await service.match(mockUsers[2]._id);
  //   expect(res).toEqual({ message: 'User not found.' });
  // });
});
