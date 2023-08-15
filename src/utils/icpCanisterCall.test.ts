import { callCanister } from './icpCanisterCall';


describe('callCanisterToLocal', () => {
    test('should return a result', async () => {
        const canisterId = 'ivx75-2maaa-aaaaa-qabsq-cai';
        const method = 'greet';
        const args: any[] = ['abing'];

        const result = await callCanister(true, canisterId, method, ...args);
    });
});

describe('callCanisterToIc', () => {
    test('should return a result', async () => {
        const canisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
        const method = 'name';
        const args: any[] = [];

        const result = await callCanister(false ,canisterId, method, ...args);
    });
});
