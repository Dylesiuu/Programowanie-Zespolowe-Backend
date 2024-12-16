import { Test, TestingModule } from '@nestjs/testing';
import { ScrollingController } from './scrolling.controller';
import { ScrollingService } from './scrolling.service';

describe('ScrollingController', () => {
  let controller: ScrollingController;
  let mockService: Partial<ScrollingService>;

  

  beforeEach(async () => {
    mockService = {
      getPetbyIndex: jest.fn(), 
      getPetbyName: jest.fn(),  
      getAll: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrollingController],
      providers: [{
        provide: ScrollingService,
        useValue: mockService, 
      },],
    }).compile();

    controller = module.get<ScrollingController>(ScrollingController);
  });

  //test 1: poprawna inicjalizacja
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  // test 2: zwracanie danych
  it("return item from table of index 2",()=>{
      const result = controller.getData("2");
      expect(mockService.getPetbyIndex).toHaveBeenCalledWith("2"); 
  })

  //test 3: zły indeks(wartosc błedna)
  it("return rerror for index out of range",()=>{
    const result = controller.getData("-1");
    expect(mockService.getPetbyIndex).toHaveBeenCalledWith("-1");
  })

  //test 4: zły indeks(wartosc nie wystepuje)
  it("return rerror for index out of range",()=>{
    const result = controller.getData("5");
    expect(mockService.getPetbyIndex).toHaveBeenCalledWith("5");
  })

  //test 5: zły indeks(nie liczba)
  it("return error for index not a number",()=>{

    const result = controller.getData("aa");
      expect(mockService.getPetbyName).toHaveBeenCalledWith("aa");
  })

  //test 6: branie pet z imienia
  it("return pet by name",()=>{
    const result = controller.getData("Pomelo");
    expect(mockService.getPetbyName).toHaveBeenCalledWith("Pomelo");
  })

  //test 7: wiecej niz jeden pet z takim imieniem
  it("return more than one pet by name",()=>{
    const result = controller.getData("Spongebob");
    expect(mockService.getPetbyName).toHaveBeenCalledWith("Spongebob");
  })

  //test 8: zwracanie całej tablicy funkcją getAll
  it("return table by getAll function",()=>{
    const mockPetsTable = [
      {id: 0, name: "Ramen",  age: '1 rok',  discribtion: "pochodzi", gender: 'Pies', location: "Warszawa", shelter: "Schronisko",  traids: ["Spokojny", "Czuły", "Leniwy"] ,       image: '/png'},
      {id: 1, name: "Pomelo", age: '2 lata', discribtion: "pochodzi",  gender: 'Suka', location: "Toruń",    shelter: "Schronisko", traids: ["Energiczny", "Lojalny", "Ciekawski"], image: '/png'},
    ];

    jest.spyOn(mockService, 'getAll').mockReturnValue(mockPetsTable);

    const result = controller.gatAllPet();
    expect(result).toEqual(mockPetsTable);
  })


  
});
