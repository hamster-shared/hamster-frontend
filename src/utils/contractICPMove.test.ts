import {
    getExample,
    getSimpleToDo,
    toICPService,
    toDisplay,
    ICPServiceWrapper,
    getCalcDID,
    getBasisDaoDID
} from "./contractICPMove";
import {callCanister} from "./icp/icpCanisterCall";

describe('toICPMethod', () => {
    it('should return a result',  () => {
        const json = getBasisDaoDID()

        const result = toICPService(json)[0].methods;

        for(let method of result){
            console.log("// " , method.description)
            console.log(method.name+": "+toDisplay(method))
        }

    });
});

describe('callICP', () => {
    it('should call', async () => {
        const json = getCalcDID()
        // canisterId: 3e3tu-wyaaa-aaaag-abvsa-cai  network: ic
        const canisterId_ic = "yimdd-5yaaa-aaaag-abvya-cai"
        const svc = new ICPServiceWrapper( toICPService(json)[0],canisterId_ic)
        const methods = svc.methods;
        const method = methods.find(t => t.name === "add")
        expect(method).toBeDefined()

        if(method){
            // const result = await method.call(["hello"])
            // console.log(result)
            const args: any[] = [1];
           const result = await callCanister(false,canisterId_ic,"add",...args)
            console.log(result)
        }


    }, 60_000)
})


describe("testCalc", () => {
    it('add', async ()=> {
        const json = getCalcDID()
        const canisterId = "yimdd-5yaaa-aaaag-abvya-cai"
        const svc = new ICPServiceWrapper( toICPService(json)[0],canisterId)
        const methods = svc.methods;
        const method = methods.find(t => t.name === "add")
        expect(method).toBeDefined()

        if(method){
            try {
                const result = await method.call([1])
                console.log(result)
            } catch (e) {
                console.log(e)
            }
            // const result = await callCanister(false,canisterId_ic,"addTodo","abc")
            //  console.log(result)
        }
    }, 60_000)
})
