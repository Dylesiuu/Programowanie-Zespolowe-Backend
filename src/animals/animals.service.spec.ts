import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnimalsService } from './animals.service';
import { Animal, AnimalDocument } from './schemas/animal.schema';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { ObjectId } from 'mongodb';

describe('AnimalsService', () => {
  let service: AnimalsService;
  let model: Model<AnimalDocument>;

  const mockShelterId = '507f191e810c19729de860eb';
  const mockTraitIds = [
    new ObjectId('507f191e810c19729de860ec'),
    new ObjectId('507f191e810c19729de860ed'),
  ];

  const mockAnimal = {
    _id: new ObjectId('507f191e810c19729de860ea'),
    name: 'Ramen',
    birthYear: 2020,
    birthMonth: 2,
    description: 'Przyjazny pies',
    gender: 'pies',
    type: false,
    shelter: new ObjectId(mockShelterId),
    traits: mockTraitIds,
    images: ['https://ex.com/dog.jpg'],
    toObject: function () {
      return this;
    },
  };

  const mockAnimalModel = {
    create: jest.fn().mockResolvedValue(mockAnimal),
    find: jest.fn().mockResolvedValue([mockAnimal]),
    findById: jest.fn().mockResolvedValue(mockAnimal),
    findByIdAndDelete: jest.fn().mockResolvedValue(mockAnimal),
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
        gender: 'pies',
        type: false,
        shelter: mockShelterId,
        traits: ['507f191e810c19729de860ec', '507f191e810c19729de860ed'],
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
      const result = await service.findOne(mockAnimal._id);
      expect(model.findById).toHaveBeenCalledWith(mockAnimal._id);
      expect(result).toEqual({
        ...mockAnimal,
        age: '5 years',
      });
    });
  });

  describe('remove()', () => {
    it('should delete an animal and return a success message', async () => {
      const result = await service.remove(mockAnimal._id);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockAnimal._id);
      expect(result).toEqual({ message: 'Animal deleted successfully' });
    });
  });
});
