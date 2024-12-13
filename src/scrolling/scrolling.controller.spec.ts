import { Test, TestingModule } from '@nestjs/testing';
import { ScrollingController } from './scrolling.controller';
import { ScrollingService } from './scrolling.service';

describe('ScrollingController', () => {
  let controller: ScrollingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrollingController],
      providers: [ScrollingService],
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
      expect(result).toEqual({id: 2,name: "Spongebob",wiek: 10, opis: "pochodzi z bydgoszczy",foto:"image/3.png"});
  })

  //test 3: zły indeks(wartosc błedna)
  it("return rerror for index out of range",()=>{
    const result = controller.getData("-1");
      expect(result).toEqual({ error: 'Index jest Invalidą.' });
  })

  //test 4: zły indeks(wartosc nie wystepuje)
  it("return rerror for index out of range",()=>{
    const result = controller.getData("5");
      expect(result).toEqual({ error: 'Pet not found.' });
  })

  //test 4: zły indeks(nie liczba)
  it("return error for index not a number",()=>{
    const result = controller.getData("aa");
      expect(result).toEqual({ error: 'Pet with that name not found.' });
  })

  //test 5: branie pet z imienia
  it("return pet by name",()=>{
    const result = controller.getData("Pomelo");
      expect(result).toEqual([{id: 1, name: "Pomelo",    wiek: 11, opis: "pochodzi z torunia",       foto:"image/2.png"}]);
  })

  //test 6: wiecej niz jeden pet z takim imieniem
  it("return more than one pet by name",()=>{
    const result = controller.getData("Spongebob");
      expect(result).toEqual([
        {id: 2, name: "Spongebob", wiek: 10, opis: "pochodzi z bydgoszczy",    foto:"image/3.png"},
        {id: 3, name: "Spongebob", wiek: 12, opis: "pochodzi z grudziądza",    foto:"image/2.png"}
      ]);
  })


  
});
