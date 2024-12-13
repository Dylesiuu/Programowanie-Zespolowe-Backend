import { Injectable } from '@nestjs/common';
import { error, table } from 'console';

@Injectable()
export class ScrollingService {
    private tabela = [
            {id: 0, name: "Ramen",     wiek: 12, opis: "pochodzi z warszawy",      foto:"image/1.png"},
            {id: 1, name: "Pomelo",    wiek: 11, opis: "pochodzi z torunia",       foto:"image/2.png"},
            {id: 2, name: "Spongebob", wiek: 10, opis: "pochodzi z bydgoszczy",    foto:"image/3.png"},
            {id: 3, name: "Spongebob", wiek: 12, opis: "pochodzi z grudziądza",    foto:"image/2.png"},
        ];

    getPetbyIndex(id: string){
        const index = parseInt(id);
        if (isNaN(index) || index < 0 ) {
            return { error: 'Index jest Invalidą.' };
          }
        const result = this.tabela.find(item => item.id == index)
          if(!result){
            return {error: 'Pet not found.'}
          }
        return result;
        
    }
        
    getPetbyName(name: string){
        const matchingPets = this.tabela.filter(item => item.name === name);

        if (matchingPets.length === 0) {
            return { error: 'Pet with that name not found.' };
        }

        const result = [];
        matchingPets.forEach(pet => {
            const petData = this.getPetbyIndex(pet.id.toString());
            result.push(petData);
        });

        return result;
    }

}
