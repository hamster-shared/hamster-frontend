import {getExample, getSimpleToDo, toICPMethod,toDisplay} from "./contractICPMove";

describe('toICPMethod', () => {
    it('should return a result',  () => {
        const json = getExample()

        const result = toICPMethod(json);

        for(let method of result){
            console.log(method.name+": "+toDisplay(method))
        }

    });
});
