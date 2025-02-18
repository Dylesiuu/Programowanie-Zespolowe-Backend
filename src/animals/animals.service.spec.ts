import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsService } from './animals.service';
import { getModelToken } from '@nestjs/mongoose';
import { Animal } from './schemas/animal.schema';

describe('AnimalsService', () => {
  let service: AnimalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsService,
        {
          provide: getModelToken(Animal.name),
          useValue: {
            // Mock implementation of the model methods
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            // Add other methods as needed
          },
        },
      ],
    }).compile();

    service = module.get<AnimalsService>(AnimalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
