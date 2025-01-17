import { Test, TestingModule } from '@nestjs/testing';
import { ScrollingService } from './scrolling.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet} from './schema/pet.schema';
import { find, generate } from 'rxjs';

// const mockPetsTable = [
//   { id: 1, name: "Pomelo",    age: '2 lata'},
//   { id: 2, name: "Spongebob", age: '4 lata'},
//   { id: 3, name: "Spongebob", age: '2 lata'},
// ];

const mockPet = [
  {
    id: 0,
    name: "Ramen",
    age: '1 rok',
    discribtion: "pochodzi z warszawy",
    gender: 'Pies',
    location: "Warszawa",
    shelter: "Schronisko na Paluchu",
    traits: ["Spokojny", "Czuły", "Leniwy"],
    image: 'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg'
  },
  {
    id: 1,
    name: "Pomelo",
    age: '2 lata',
    discribtion: "pochodzi z torunia",
    gender: 'Suka',
    location: "Toruń",
    shelter: "Schronisko dla zwierząt w Toruniu",
    traits: ["Energiczny", "Lojalny", "Ciekawski"],
    image: 'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png'
  },
  {
    id: 2,
    name: "Spongebob",
    age: '4 lata',
    discribtion: "pochodzi z bydgoszczy",
    gender: 'Pies',
    location: "Bydgoszcz",
    shelter: "Schronisko dla Zwierząt w Bydgoszczy",
    traits: ["Przyjacielski", "Energiczny", "Figlarny"],
    image: 'https://dogshome.com/wp-content/uploads/animalimages//1139184/556697c795ff443c8969ac1c81f9a95a-1728272579-1728272583_other.jpg'
  }
];

const mockPetModel = {
  find: jest.fn().mockResolvedValue(mockPet[0]),
  findOne: jest.fn().mockResolvedValue([mockPet]),
}

describe('ScrollingService', () => {
  let service: ScrollingService;

  const mockPetsTable = [
    { id: 1, name: 'Pomelo', age: '2 lata' },
    { id: 2, name: 'Spongebob', age: '4 lata' },
    { id: 3, name: 'Spongebob', age: '2 lata' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrollingService,
        {
          provide: getModelToken('Pet'),
          useValue: mockPetModel,
        },
      ],
    }).compile();

    service = module.get<ScrollingService>(ScrollingService);
    model = module.get<Model<Pet>>(getModelToken(Pet.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // test 2: zwracanie danych
  it('return item from table of index 2', () => {
    const result = service.getPetbyIndex('2');
    expect(result).toEqual(mockPetsTable[1]);
  });

  //test 3: zły indeks(wartosc poza zakresem)
  it('return rerror for index out of range', () => {
    const result = service.getPetbyIndex('-1');
    expect(result).toEqual({ error: 'Index is Invalid.' });
  });

  //test 4: zły indeks(wartosc poza zakresem)
  it('return rerror for index not in table', () => {
    const result = service.getPetbyIndex('5');
    expect(result).toEqual({ error: 'Pet not found.' });
  });

  //test 5: zły indeks(nie liczba)
  it('return error for index not a number', () => {
    const result = service.getPetbyIndex('aa');
    expect(result).toEqual({ error: 'Index is Invalid.' });
  });

  // test 6: zwracanie danych z nazwy
  it('return item from table of name', () => {
    const result = service.getPetbyName('Pomelo');
    expect(result).toEqual([mockPetsTable[0]]);
  });

  //test 7: zła nazwa
  it('return rerror cause name not found', () => {
    const result = service.getPetbyIndex('5');
    expect(result).toEqual({ error: 'Pet not found.' });
  });

  //test 8: wiecej niz jeden pet z takim imieniem
  it('return more than one pet by name', () => {
    const result = service.getPetbyName('Spongebob');
    expect(result).toEqual([mockPetsTable[1], mockPetsTable[2]]);
  });

  //test 9: zwracanie całej tablicy funkcją getAll
  it('return table by getAll function', () => {
    const result = service.getAll();
    expect(result).toEqual(mockPetsTable);
  });
});
