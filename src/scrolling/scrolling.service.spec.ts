import { Test, TestingModule } from '@nestjs/testing';
import { ScrollingService } from './scrolling.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
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
import { Shelter, ShelterDocument } from '../shelters/schemas/shelter.schema';
import { Animal, AnimalDocument } from '../animals/schemas/animal.schema';
import { calculateAge } from '../utils/calculateAge';

const mockPet = [
  {
    _id: new ObjectId('48a1b2c3d4e5f6a7b8c9d0e2'),
    name: 'Spongebob',
    birthYear: 2023,
    birthMonth: 6,
    description: 'pochodzi z warszawy',
    gender: 'Pies',
    type: false,
    shelter: new ObjectId('60af8845e13b1c002b1a1b45'),
    traits: [
      new ObjectId('507f1f77bcf86cd799439011'),
      new ObjectId('5f50c31b1c9d440000a1b2c3'),
    ],
    images: [
      'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
    ],
    toObject: jest.fn().mockReturnValue({
      _id: new ObjectId('48a1b2c3d4e5f6a7b8c9d0e2'),
      name: 'Spongebob',
      birthYear: 2023,
      birthMonth: 6,
      description: 'pochodzi z warszawy',
      gender: 'Pies',
      type: false,
      shelter: new ObjectId('60af8845e13b1c002b1a1b45'),
      traits: [
        new ObjectId('507f1f77bcf86cd799439011'),
        new ObjectId('5f50c31b1c9d440000a1b2c3'),
      ],
      images: [
        'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
      ],
    }),
  },
  {
    _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
    name: 'Pomelo',
    birthYear: 2022,
    birthMonth: 4,
    description: 'pochodzi z torunia',
    gender: 'Suka',
    type: true,
    shelter: new ObjectId('60af8845e13b1c002b1a1b46'),
    traits: [new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8')],
    images: [
      'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
    ],
    toObject: jest.fn().mockReturnValue({
      _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
      name: 'Pomelo',
      birthYear: 2022,
      birthMonth: 4,
      description: 'pochodzi z torunia',
      gender: 'Suka',
      type: true,
      shelter: new ObjectId('60af8845e13b1c002b1a1b46'),
      traits: [new ObjectId('63e4d5a7f1a2b3c4d5e6f7a8')],
      images: [
        'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
      ],
    }),
  },
  {
    _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7b9'),
    name: 'Spongebob',
    birthYear: 2020,
    birthMonth: 3,
    description: 'pochodzi z bydgoszczy',
    gender: 'Pies',
    type: false,
    shelter: new ObjectId('60af8845e13b1c002b1a1b47'),
    traits: [
      new ObjectId('507f1f77bcf86cd799439011'),
      new ObjectId('4e4d5a7f1a2b3c4d5e6f7a89'),
    ],
    images: [
      'https://dogshome.com/wp-content/uploads/animalimages//1139184/556697c795ff443c8969ac1c81f9a95a-1728272579-1728272583_other.jpg',
    ],
    toObject: jest.fn().mockReturnValue({
      _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7b9'),
      name: 'Spongebob',
      birthYear: 2020,
      birthMonth: 3,
      description: 'pochodzi z bydgoszczy',
      gender: 'Pies',
      type: false,
      shelter: new ObjectId('60af8845e13b1c002b1a1b47'),
      traits: [
        new ObjectId('507f1f77bcf86cd799439011'),
        new ObjectId('4e4d5a7f1a2b3c4d5e6f7a89'),
      ],
      images: [
        'https://dogshome.com/wp-content/uploads/animalimages//1139184/556697c795ff443c8969ac1c81f9a95a-1728272579-1728272583_other.jpg',
      ],
    }),
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

describe('ScrollingService', () => {
  let service: ScrollingService;
  const animalModel = mock<Model<AnimalDocument>>();
  const userModel = mock<Model<UserDocument>>();
  const userTraitModel = mock<Model<UserTraitDocument>>();
  const animalTraitModel = mock<Model<AnimalTraitDocument>>();
  const shelterModel = mock<Model<ShelterDocument>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrollingService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        { provide: getModelToken(Animal.name), useValue: animalModel },
        { provide: getModelToken(UserTrait.name), useValue: userTraitModel },
        {
          provide: getModelToken(AnimalTrait.name),
          useValue: animalTraitModel,
        },
        { provide: getModelToken(Shelter.name), useValue: shelterModel },
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

  it('should return a pet by id', async () => {
    jest.spyOn(animalModel, 'findOne').mockResolvedValue(mockPet[1]);

    const result = await service.getPetbyIndex(mockPet[1]._id.toString());
    const { toObject, ...expectedResult } = mockPet[1];

    expect(result).toEqual({
      ...expectedResult,
      age: calculateAge(expectedResult.birthYear, expectedResult.birthMonth),
    });
    expect(animalModel.findOne).toHaveBeenCalledWith({ _id: mockPet[1]._id });
  });

  it('return rerror for index not in table', async () => {
    jest.spyOn(animalModel, 'findOne').mockReturnValue(null);

    const result = await service.getPetbyIndex('507f1f77bcf86cd799439011');
    expect(result).toEqual({ message: 'Pet not found.' });
  });

  it('return error for index not a number', async () => {
    const result = await service.getPetbyIndex('aa');
    expect(result).toEqual({ message: 'Index is Invalid.' });
  });

  it('return item from table of name', async () => {
    jest.spyOn(animalModel, 'find').mockResolvedValue([mockPet[1]]);

    const result = await service.getPetbyName('Pomelo');
    const { toObject, ...expectedResult } = mockPet[1];

    expect(result).toEqual([
      {
        ...expectedResult,
        age: calculateAge(expectedResult.birthYear, expectedResult.birthMonth),
      },
    ]);
  });

  it('return error cause name not found', async () => {
    jest.spyOn(animalModel, 'find').mockResolvedValue([]);
    const result = await service.getPetbyName('5321');
    expect(result).toEqual({ message: 'Pet not found.' });
  });

  it('return more than one pet by name', async () => {
    jest.spyOn(animalModel, 'find').mockResolvedValue([mockPet[0], mockPet[2]]);
    const result = await service.getPetbyName('Spongebob');

    const expectedResult = mockPet.map((animal) => {
      const { toObject, ...rest } = animal;
      return { ...rest, age: calculateAge(rest.birthYear, rest.birthMonth) };
    });

    expect(result).toEqual([expectedResult[0], expectedResult[2]]);
  });

  it('return table by getAll function', async () => {
    jest.spyOn(animalModel, 'find').mockResolvedValue(mockPet);

    const result = await service.getAll();

    const expectedResult = mockPet.map((animal) => {
      const { toObject, ...rest } = animal;
      return { ...rest, age: calculateAge(rest.birthYear, rest.birthMonth) };
    });
    
    expect(result).toEqual(expectedResult);
  });

  it('should return matched animals if user is found', async () => {
    const mockUserWithtraits = {
      _id: new ObjectId('65f4c8e9f0a5a4d3b4a54321'),
      name: 'Piotr',
      lastname: 'Wiśniewski',
      email: 'piotr.wisniewski@example.com',
      password: '$2b$12$gio35jsogsDCsopFUrvYcOm8HEcedZ9aWqYpJnmuj.qWvEOFwzB0m',
      favourites: [0, 1, 2],
      traits: [mockUserTraits[1], mockUserTraits[2]],
    };

    const mockShleters = [
      {
        _id: new ObjectId('60a1b2c3d4e5f6a7b8c9d0e1'),
        location: [52.2297, 21.0122],
        animals: [
          '48a1b2c3d4e5f6a7b8c9d0e2', //(Spongebob)
          '72f1a2b3c4d5e6f7a8b9c0d3', //(Pomelo)
        ],
      },
      {
        _id: new ObjectId('70f1a2b3c4d5e6f7a8b9c0d2'),
        location: [53.0138, 18.5984],
        animals: [
          '63e4d5a7f1a2b3c4d5e6f7b9', //(Spongebob z Bydgoszczy)
        ],
      },
    ];

    const mockAnimalWithTraits = [
      {
        _id: new ObjectId('48a1b2c3d4e5f6a7b8c9d0e2'),
        name: 'Spongebob',
        birthYear: 2020,
        birthMonth: 3,
        description: 'pochodzi z warszawy',
        gender: 'Pies',
        shelter: '60a1b2c3d4e5f6a7b8c9d0e1',
        traits: [mockAnimalTraits[0], mockAnimalTraits[1]],
        images: [
          'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
        ],
        toObject: jest.fn().mockReturnValue({
          _id: new ObjectId('48a1b2c3d4e5f6a7b8c9d0e2'),
          name: 'Spongebob',
          birthYear: 2020,
          birthMonth: 3,
          description: 'pochodzi z warszawy',
          gender: 'Pies',
          shelter: '60a1b2c3d4e5f6a7b8c9d0e1',
          traits: [mockAnimalTraits[0], mockAnimalTraits[1]],
          images: [
            'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg',
          ],
        }),
      },
      {
        _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
        name: 'Pomelo',
        birthYear: 2020,
        birthMonth: 3,
        description: 'pochodzi z torunia',
        gender: 'Suka',
        shelter: '60a1b2c3d4e5f6a7b8c9d0e1',
        traits: [mockAnimalTraits[2]],
        images: [
          'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
        ],
        toObject: jest.fn().mockReturnValue({
          _id: new ObjectId('72f1a2b3c4d5e6f7a8b9c0d3'),
          name: 'Pomelo',
          birthYear: 2020,
          birthMonth: 3,
          description: 'pochodzi z torunia',
          gender: 'Suka',
          shelter: '60a1b2c3d4e5f6a7b8c9d0e1',
          traits: [mockAnimalTraits[2]],
          images: [
            'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png',
          ],
        }),
      },
      {
        _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7b9'),
        name: 'Spongebob',
        birthYear: 2020,
        birthMonth: 3,
        description: 'pochodzi z bydgoszczy',
        gendedr: 'Pies',
        shelter: '70f1a2b3c4d5e6f7a8b9c0d2',
        traits: [mockAnimalTraits[0], mockAnimalTraits[3]],
        images: [
          'https://dogshome.com/wp-content/uploads/animalimages//1139184/556697c795ff443c8969ac1c81f9a95a-1728272579-1728272583_other.jpg',
        ],
        toObject: jest.fn().mockReturnValue({
          _id: new ObjectId('63e4d5a7f1a2b3c4d5e6f7b9'),
          name: 'Spongebob',
          birthYear: 2020,
          birthMonth: 3,
          description: 'pochodzi z bydgoszczy',
          gender: 'Pies',
          shelter: '70f1a2b3c4d5e6f7a8b9c0d2',
          traits: [mockAnimalTraits[0], mockAnimalTraits[3]],
          images: [
            'https://dogshome.com/wp-content/uploads/animalimages//1139184/556697c795ff443c8969ac1c81f9a95a-1728272579-1728272583_other.jpg',
          ],
        }),
      },
    ];

    animalModel.find.mockResolvedValue(mockPet);
    userModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        toObject: jest.fn().mockReturnValue(mockUserWithtraits),
      }),
    } as any);
    animalModel.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockAnimalWithTraits),
    } as any);
    shelterModel.find.mockResolvedValue([mockShleters[0]]);

    const result = await service.match(
      mockUsers[2]._id,
      52.2297,
      21.0122,
      1000,
    );

    const expectedResult = mockAnimalWithTraits.map((animal) => {
      const { toObject, ...rest } = animal;
      return { ...rest, age: calculateAge(rest.birthYear, rest.birthMonth) };
    });

    expect(result).toEqual({
      message: 'Matched animals',
      matchedAnimals: [expectedResult[1]],
      userWithTraits: mockUserWithtraits,
    });
  });

  it('shuld return message if no pets found', async () => {
    shelterModel.find.mockResolvedValue([]);
    animalModel.find.mockResolvedValue([]);
    userModel.findById.mockResolvedValue(mockUsers[2]);

    const res = await service.match(mockUsers[2]._id, 52.2297, 21.0122, 1000);
    expect(res).toEqual({ message: 'No pets found.' });
  });

  it('should return message if user not found', async () => {
    const mockShleters = [
      {
        _id: new ObjectId('60a1b2c3d4e5f6a7b8c9d0e1'),
        location: [52.2297, 21.0122],
        animals: [
          '48a1b2c3d4e5f6a7b8c9d0e2', //(Spongebob)
          '72f1a2b3c4d5e6f7a8b9c0d3', //(Pomelo)
        ],
      },
      {
        _id: new ObjectId('70f1a2b3c4d5e6f7a8b9c0d2'),
        location: [53.0138, 18.5984],
        animals: [
          '63e4d5a7f1a2b3c4d5e6f7b9', //(Spongebob z Bydgoszczy)
        ],
      },
    ];
    shelterModel.find.mockResolvedValue(mockShleters);
    animalModel.find.mockResolvedValue(mockPet);
    userModel.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    } as any);

    const res = await service.match(mockUsers[2]._id, 52.2297, 21.0122, 1000);
    expect(res).toEqual({ message: 'User not found.' });
  });
});
