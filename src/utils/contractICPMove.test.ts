import {getExample, getSimpleToDo, toICPService, toDisplay, ICPServiceWrapper} from "./contractICPMove";
import {callCanister} from "./icpCanisterCall"

describe('toICPMethod', () => {
    it('should return a result',  () => {
        const json = getExample()

        const result = toICPService(json)[0].methods;

        for(let method of result){
            console.log(method.name+": "+toDisplay(method))
        }

    });
});

describe('callICP', () => {
    it('should call', async () => {
        const json = getSimpleToDo()
        // canisterId: 3e3tu-wyaaa-aaaag-abvsa-cai  network: ic
        const canisterId_ic = "3e3tu-wyaaa-aaaag-abvsa-cai"
        const canisterId_local = "avqkn-guaaa-aaaaa-qaaea-cai"
        const svc = new ICPServiceWrapper( toICPService(json)[0],canisterId_ic)
        const methods = svc.methods;
        const method = methods.find(t => t.name === "addTodo")
        expect(method).toBeDefined()

        if(method){
            const result = await method.call(["hello"])
            console.log(result)

           // const result = await callCanister(false,canisterId_ic,"addTodo","abc")
           //  console.log(result)
        }


    }, 15_000)
})
