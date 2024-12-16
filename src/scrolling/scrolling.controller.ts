import { Controller, Get, Param } from '@nestjs/common';
import { ScrollingService } from './scrolling.service';


@Controller('scrolling')
export class ScrollingController {
    private scrollingService;

    constructor(scrollingService: ScrollingService){
        this.scrollingService = scrollingService;
    }
    

    @Get(':arg')
    getData(@Param('arg') arg:string){
        const isInteger = (value: string): boolean => {
            return !isNaN(parseInt(value, 10));
          };
        if(isInteger(arg)){
            return this.scrollingService.getPetbyIndex(arg);
        }
        else{
            return this.scrollingService.getPetbyName(arg);
        }
    }

    @Get('')
    gatAllPet(){
        return this.scrollingService.getAll();
    }
    

}
