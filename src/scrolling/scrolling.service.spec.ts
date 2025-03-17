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
  AnimalTrait,
  AnimalTraitDocument,
} from '../traits/schemas/animalTrait.schema';
import { populate } from 'dotenv';

const mockPet = [
  {
    _id: new ObjectId('48a1b2c3d4e5f6a7b8c9d0e2'),
    name: 'Spongebob',
    age: '1 rok',
    discribtion: 'pochodzi z warszawy',
    gender: 'Pies',
    location: 'Warszawa',
    shelter: 'Schronisko na Paluchu',
    traits: [
      new ObjectId('507f1f77bcf86cd799439011'),
      new ObjectId('5f50c31b1c9d440000a1b2c3'),
    ],
    image:
      'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
  },
  {
    _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
    name: 'Pomelo',
    age: '2 lata',
    discribtion: 'pochodzi z torunia',
    gender: 'Suka',
    location: 'Toruń',
    shelter: 'Schronisko dla zwierząt w Toruniu',
    traits: [new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8')],
    image:
      'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
  },
  {
    _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7b9'),
    name: 'Spongebob',
    age: '4 lata',
    discribtion: 'pochodzi z bydgoszczy',
    gender: 'Pies',
    location: 'Bydgoszcz',
    shelter: 'Schronisko dla Zwierząt w Bydgoszczy',
    traits: [
      new ObjectId('507f1f77bcf86cd799439011'),
      new ObjectId('4e4d5a7f1a2b3c4d5e6f7a89'),
    ],
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
    traits: [new ObjectId('65f1a2b3c4d5e6f7a8b9c0d1')],
  },
  {
    _id: new ObjectId('65f4c8e9f0a5a4d3b4a67890'),
    name: 'Anna',
    lastname: 'Nowak',
    email: 'anna.nowak@example.com',
    password: 'strongpass456',
    favourites: [1],
    traits: [new ObjectId('55e4d5a7f1a2b3c4d5e6f7a8')],
  },
  {
    _id: new ObjectId('65f4c8e9f0a5a4d3b4a54321'),
    name: 'Piotr',
    lastname: 'Wiśniewski',
    email: 'piotr.wisniewski@example.com',
    password: 'mypassword789',
    favourites: [0, 1, 2],
    traits: [
      new ObjectId('55e4d5a7f1a2b3c4d5e6f7a8'),
      new ObjectId('70c72b2f9b1d8e4a5f6e7d8c'),
    ],
  },
];

const mockUserTraits = [
  {
    _id: new ObjectId('65f1a2b3c4d5e6f7a8b9c0d1'),
    name: 'Trait 1',
    animalTraits: [
      new ObjectId('507f1f77bcf86cd799439011'),
      new ObjectId('5f50c31b1c9d440000a1b2c3'),
      new ObjectId('4e4d5a7f1a2b3c4d5e6f7a89'),
    ],
  },
  {
    _id: new ObjectId('55e4d5a7f1a2b3c4d5e6f7a8'),
    name: 'Trait 2',
    animalTraits: [
      new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8'),
      new ObjectId('60c72b2f9b1d8e4a5f6e7d8c'),
      new ObjectId('65a1b2c3d4e5f6a7b8c9d0e1'),
    ],
  },
  {
    _id: new ObjectId('70c72b2f9b1d8e4a5f6e7d8c'),
    name: 'Trait 3',
    animalTraits: [new ObjectId('55a4d5a7f1a2b3c4d5e6f7a8')],
  },
];

const mockAnimalTraits = [
  {
    _id: new ObjectId('507f1f77bcf86cd799439011'),
    name: 'Trait 1',
    priority: 1,
  },
  {
    _id: new ObjectId('5f50c31b1c9d440000a1b2c3'),
    name: 'Trait 2',
    priority: 2,
  },
  {
    _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8'),
    name: 'Trait 3',
    priority: 3,
  },
  {
    _id: new ObjectId('4e4d5a7f1a2b3c4d5e6f7a89'),
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
  const petModel = mock<Model<Pet>>();
  const userModel = mock<Model<UserDocument>>();
  const userTraitModel = mock<Model<UserTraitDocument>>();
  const animalTraitModel = mock<Model<AnimalTraitDocument>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrollingService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        { provide: getModelToken(Pet.name), useValue: petModel },
        { provide: getModelToken(UserTrait.name), useValue: userTraitModel },
        {
          provide: getModelToken(AnimalTrait.name),
          useValue: animalTraitModel,
        },
      ],
    }).compile();

    service = module.get<ScrollingService>(ScrollingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // test 2: zwracanie danych
  it('should return a pet by id', async () => {
    jest.spyOn(petModel, 'findOne').mockResolvedValue(mockPet[1]);

    const result = await service.getPetbyIndex(mockPet[1]._id.toString());
    expect(result).toEqual(mockPet[1]);
    expect(petModel.findOne).toHaveBeenCalledWith({ id: mockPet[1]._id });
  });

  it('return rerror for index not in table', async () => {
    jest.spyOn(petModel, 'findOne').mockReturnValue(null);

    const result = await service.getPetbyIndex('507f1f77bcf86cd799439011');
    expect(result).toEqual({ error: 'Pet not found.' });
  });

  //test 5: zły indeks(nie liczba)
  it('return error for index not a number', async () => {
    const result = await service.getPetbyIndex('aa');
    expect(result).toEqual({ error: 'Index is Invalid.' });
  });

  // test 6: zwracanie danych z nazwy
  it('return item from table of name', async () => {
    jest.spyOn(petModel, 'find').mockResolvedValue([mockPet[1]]);

    const result = await service.getPetbyName('Pomelo');
    expect(result).toEqual([mockPet[1]]);
  });

  //test 7: zła nazwa
  it('return error cause name not found', async () => {
    jest.spyOn(petModel, 'find').mockResolvedValue([]);
    const result = await service.getPetbyName('5321');
    expect(result).toEqual({ error: 'Pet with that name not found.' });
  });

  //test 8: wiecej niz jeden pet z takim imieniem
  it('return more than one pet by name', async () => {
    jest.spyOn(petModel, 'find').mockResolvedValue([mockPet[0], mockPet[2]]);
    const result = await service.getPetbyName('Spongebob');
    expect(result).toEqual([mockPet[0], mockPet[2]]);
  });

  //test 9: zwracanie całej tablicy funkcją getAll
  it('return table by getAll function', async () => {
    jest.spyOn(petModel, 'find').mockResolvedValue(mockPet);

    const result = await service.getAll();
    expect(result).toEqual(mockPet);
  });

  it('should return matched animals if user is found', async () => {
    const mockUserWithtraits = {
      _id: new ObjectId('65f4c8e9f0a5a4d3b4a54321'),
      name: 'Piotr',
      lastname: 'Wiśniewski',
      email: 'piotr.wisniewski@example.com',
      password: 'mypassword789',
      favourites: [0, 1, 2],
      traits: [mockUserTraits[1], mockUserTraits[2]],
    };

    const mockAnimalWithTraits = [
      {
        _id: new ObjectId('48a1b2c3d4e5f6a7b8c9d0e2'),
        name: 'Spongebob',
        age: '1 rok',
        discribtion: 'pochodzi z warszawy',
        gender: 'Pies',
        location: 'Warszawa',
        shelter: 'Schronisko na Paluchu',
        traits: [mockAnimalTraits[0], mockAnimalTraits[1]],
        image:
          'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
        toObject: jest.fn().mockReturnValue({
          _id: new ObjectId('48a1b2c3d4e5f6a7b8c9d0e2'),
          name: 'Spongebob',
          age: '1 rok',
          discribtion: 'pochodzi z warszawy',
          gender: 'Pies',
          location: 'Warszawa',
          shelter: 'Schronisko na Paluchu',
          traits: [mockAnimalTraits[0], mockAnimalTraits[1]],
          image:
            'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
        }),
      },
      {
        _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
        name: 'Pomelo',
        age: '2 lata',
        discribtion: 'pochodzi z torunia',
        gender: 'Suka',
        location: 'Toruń',
        shelter: 'Schronisko dla zwierząt w Toruniu',
        traits: [mockAnimalTraits[2]],
        image:
          'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
        toObject: jest.fn().mockReturnValue({
          _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
          name: 'Pomelo',
          age: '2 lata',
          discribtion: 'pochodzi z torunia',
          gender: 'Suka',
          location: 'Toruń',
          shelter: 'Schronisko dla zwierząt w Toruniu',
          traits: [mockAnimalTraits[2]],
          image:
            'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
        }),
      },
      {
        _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7b9'),
        name: 'Spongebob',
        age: '4 lata',
        discribtion: 'pochodzi z bydgoszczy',
        gender: 'Pies',
        location: 'Bydgoszcz',
        shelter: 'Schronisko dla Zwierząt w Bydgoszczy',
        traits: [mockAnimalTraits[0], mockAnimalTraits[3]],
        image:
          'https://dogshome.com/wp-content/uploads/animalimages//1139184/556697c795ff443c8969ac1c81f9a95a-1728272579-1728272583_other.jpg',
        toObject: jest.fn().mockReturnValue({
          _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7b9'),
          name: 'Spongebob',
          age: '4 lata',
          discribtion: 'pochodzi z bydgoszczy',
          gender: 'Pies',
          location: 'Bydgoszcz',
          shelter: 'Schronisko dla Zwierząt w Bydgoszczy',
          traits: [mockAnimalTraits[0], mockAnimalTraits[3]],
          image:
            'https://dogshome.com/wp-content/uploads/animalimages//1139184/556697c795ff443c8969ac1c81f9a95a-1728272579-1728272583_other.jpg',
        }),
      },
    ];

    petModel.find.mockResolvedValue(mockPet);
    userModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        toObject: jest.fn().mockReturnValue(mockUserWithtraits),
      }),
    } as any);
    petModel.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockAnimalWithTraits),
    } as any);

    const result = await service.match(mockUsers[2]._id);

    const expectedResult = mockAnimalWithTraits.map((animal) => {
      const { toObject, ...rest } = animal;
      return rest;
    });
    console.log(expectedResult);

    expect(result).toEqual({
      message: 'Matched animals',
      matchedAnimals: [expectedResult[1]],
      userWithTraits: mockUserWithtraits,
    });
  });

  it('shuld return message if no pets found', async () => {
    petModel.find.mockResolvedValue([]);
    userModel.findById.mockResolvedValue(mockUsers[2]);

    const res = await service.match(mockUsers[2]._id);
    expect(res).toEqual({ message: 'No pets found.' });
  });

  it('should return message if user not found', async () => {
    petModel.find.mockResolvedValue(mockPet);
    userModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    } as any);

    const res = await service.match(mockUsers[2]._id);
    expect(res).toEqual({ message: 'User not found.' });
  });
});
