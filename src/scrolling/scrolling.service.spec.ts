import { Test, TestingModule } from '@nestjs/testing';
import { ScrollingService } from './scrolling.service';

describe('ScrollingService', () => {
  let service: ScrollingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrollingService],
    }).compile();

    service = module.get<ScrollingService>(ScrollingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // test 2: zwracanie danych
  it("return item from table of index 2",()=>{
    const result = service.getPetbyIndex("2");
    expect(result).toEqual({id: 2,name: "Spongebob",wiek: 10, opis: "pochodzi z bydgoszczy",foto:"image/3.png"});
  })

  //test 3: zły indeks(wartosc poza zakresem)
  it("return rerror for index out of range",()=>{
    const result = service.getPetbyIndex("-1");
      expect(result).toEqual({ error: 'Index jest Invalidą.' });
  })

  //test 4: zły indeks(wartosc poza zakresem)
  it("return rerror for index not in table",()=>{
    const result = service.getPetbyIndex("5");
      expect(result).toEqual({error: 'Pet not found.'});
  })

  //test 5: zły indeks(nie liczba)
  it("return error for index not a number",()=>{
    const result = service.getPetbyIndex("aa");
      expect(result).toEqual({ error: 'Index jest Invalidą.' });
  })

  // test 6: zwracanie danych z nazwy
  it("return item from table of name Pomelo",()=>{
    const result = service.getPetbyName("Pomelo");
    expect(result).toEqual([{id: 1, name: "Pomelo",wiek: 11, opis: "pochodzi z torunia",foto:"image/2.png"}]);
  })

  //test 7: zła nazwa
  it("return rerror cause name not found",()=>{
    const result = service.getPetbyIndex("5");
      expect(result).toEqual({error: 'Pet not found.'});
  })

  //test 8: wiecej niz jeden pet z takim imieniem
  it("return more than one pet by name",()=>{
    const result = service.getPetbyName("Spongebob");
      expect(result).toEqual([
        {id: 2, name: "Spongebob", wiek: 10, opis: "pochodzi z bydgoszczy",    foto:"image/3.png"},
        {id: 3, name: "Spongebob", wiek: 12, opis: "pochodzi z grudziądza",    foto:"image/2.png"}
      ]);
  })


});
