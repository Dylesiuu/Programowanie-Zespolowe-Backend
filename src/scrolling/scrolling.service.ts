import { Injectable } from '@nestjs/common';
import { error, table } from 'console';

@Injectable()
export class ScrollingService {
    private tabela = [
            {id: 0, name: "Ramen",     age: '1 rok',    discribtion: "pochodzi z warszawy",     gender: 'Pies',     location: "Warszawa",  shelter: "Schronisko na Paluchu",                traids: ["Spokojny", "Czuły", "Leniwy"] , image: 'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg'},
            {id: 1, name: "Pomelo",    age: '2 lata',   discribtion: "pochodzi z torunia",      gender: 'Suka',     location: "Toruń",     shelter: "Schronisko dla zwierząt w Toruniu",    traids: ["Energiczny", "Lojalny", "Ciekawski"], image: 'https://www.rspcasa.org.au/wp-content/uploads/2024/08/Cat-Management-Act-Review-2-768x527.png'},
            {id: 2, name: "Spongebob", age: '4 lata',   discribtion: "pochodzi z bydgoszczy",   gender: 'Pies',     location: "Bydgoszcz", shelter: "Schronisko dla Zwierząt w Bydgoszczy", treids: ["Przyjacielski", "Energiczny", "Figlarny"], image: 'https://dogshome.com/wp-content/uploads/animalimages//1139184/556697c795ff443c8969ac1c81f9a95a-1728272579-1728272583_other.jpg'},
            {id: 3, name: "Spongebob", age: '2 lata',   discribtion: "pochodzi z grudziądza",   gender: 'Pies',     location: "Grudziądz", shelter: "Centrum Opieki nad Zwierzętami",       treids: ["Agresywny", "Głośny", "Leniwy"], image: 'https://pettownsendvet.com/wp-content/uploads/2023/01/iStock-1052880600-1024x683.jpg'},
        ];

    getPetbyIndex(id: string){
        const index = parseInt(id);
        if (isNaN(index) || index < 0 ) {
            return { error: 'Index is Invalid.' };
          }
        const result = this.tabela.find(item => item.id == index)
          if(!result){
            return {error: 'Pet not found.'}
          }
        return result;
        
    }

    getAll(){
        return this.tabela;
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
