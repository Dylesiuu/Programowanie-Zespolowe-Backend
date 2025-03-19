import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AnimalsService } from './animals.service';
import { Animal, AnimalDocument } from './schemas/animal.schema';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { calculateAge } from '../utils/calculateAge';

describe('AnimalsService', () => {
  let service: AnimalsService;
  let model: Model<AnimalDocument>;

  const mockShelterId = new Types.ObjectId();
  const mockTraitIds = [new Types.ObjectId(), new Types.ObjectId()];

  const mockAnimal = {
    _id: new Types.ObjectId('507f191e810c19729de860ea'),
    name: 'Ramen',
    birthYear: 2020,
    birthMonth: 2,
    description: 'Przyjazny pies',
    gender: 'male',
    type: false,
    shelter: mockShelterId,
    traits: mockTraitIds,
    images: ['https://ex.com/dog.jpg'],
    toObject: function () {
      return this;
    },
  };

  const mockAnimalModel = {
    create: jest.fn().mockResolvedValue(mockAnimal),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockAnimal]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockAnimal),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockAnimal),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalsService,
        {
          provide: getModelToken(Animal.name),
          useValue: mockAnimalModel,
        },
      ],
    }).compile();

    service = module.get<AnimalsService>(AnimalsService);
    model = module.get<Model<AnimalDocument>>(getModelToken(Animal.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new animal', async () => {
      const createAnimalDto: CreateAnimalDto = {
        name: 'Ramen',
        birthYear: 2020,
        birthMonth: 2,
        description: 'Przyjazny pies',
        gender: 'male',
        type: false,
        shelter: mockShelterId.toString(),
        traits: mockTraitIds.map((id) => id.toString()),
        images: ['https://ex.com/dog.jpg'],
      };

      const result = await service.create(createAnimalDto);
      expect(model.create).toHaveBeenCalledWith(createAnimalDto);
      expect(result).toEqual({
        message: 'Animal created successfully',
        animal: mockAnimal,
      });
    });
  });

  describe('findAll()', () => {
    it('should return an array of animals with calculated ages', async () => {
      const result = await service.findAll();
      expect(model.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        ...mockAnimal,
        age: '5 years',
      });
    });
  });

  describe('findOne()', () => {
    it('should return a single animal with calculated age', async () => {
      const result = await service.findOne('507f191e810c19729de860ea');
      expect(model.findById).toHaveBeenCalledWith('507f191e810c19729de860ea');
      expect(result).toEqual({
        ...mockAnimal,
        age: '5 years',
      });
    });
  });

  describe('remove()', () => {
    it('should delete an animal and return a success message', async () => {
      const result = await service.remove('507f191e810c19729de860ea');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(
        '507f191e810c19729de860ea',
      );
      expect(result).toEqual({ message: 'Animal deleted successfully' });
    });
  });
});
