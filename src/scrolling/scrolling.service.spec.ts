import { Test, TestingModule } from '@nestjs/testing';
import { ScrollingService } from './scrolling.service';

describe('ScrollingService', () => {
  let service: ScrollingService;

  const mockPetsTable = [
    { id: 1, name: "Pomelo",    age: '2 lata'},
    { id: 2, name: "Spongebob", age: '4 lata'},
    { id: 3, name: "Spongebob", age: '2 lata'},
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrollingService],
    }).compile();

    service = module.get<ScrollingService>(ScrollingService);
    (service as any).tabela = mockPetsTable;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // test 2: zwracanie danych
  it("return item from table of index 2",()=>{
    const result = service.getPetbyIndex("2");
    expect(result).toEqual(mockPetsTable[1]);
  })

  //test 3: zły indeks(wartosc poza zakresem)
  it("return rerror for index out of range",()=>{
    const result = service.getPetbyIndex("-1");
      expect(result).toEqual({ error: 'Index is Invalid.' });
  })

  //test 4: zły indeks(wartosc poza zakresem)
  it("return rerror for index not in table",()=>{
    const result = service.getPetbyIndex("5");
      expect(result).toEqual({error: 'Pet not found.'});
  })

  //test 5: zły indeks(nie liczba)
  it("return error for index not a number",()=>{
    const result = service.getPetbyIndex("aa");
      expect(result).toEqual({ error: 'Index is Invalid.' });
  })

  // test 6: zwracanie danych z nazwy
  it("return item from table of name",()=>{
    const result = service.getPetbyName("Pomelo");
    expect(result).toEqual([mockPetsTable[0]]);
  })

  //test 7: zła nazwa
  it("return rerror cause name not found",()=>{
    const result = service.getPetbyIndex("5");
      expect(result).toEqual({error: 'Pet not found.'});
  })

  //test 8: wiecej niz jeden pet z takim imieniem
  it("return more than one pet by name",()=>{
    const result = service.getPetbyName("Spongebob");
      expect(result).toEqual([mockPetsTable[1],mockPetsTable[2]]);
  })

   //test 9: zwracanie całej tablicy funkcją getAll
   it("return table by getAll function",()=>{
    const result = service.getAll();
      expect(result).toEqual(mockPetsTable);
  })




});
