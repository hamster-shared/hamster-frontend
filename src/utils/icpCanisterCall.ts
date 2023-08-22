import { local, ic } from 'abing258-ic0';

export function callCanister(localFlag: boolean, canisterId: string, method: string, ...args: any[]): Promise<any> {
    let ledger;
    if (localFlag) {
        ledger = local(canisterId);
    } else {
        ledger = ic(canisterId);
    }
    return ledger.call(method, ...args)
        .then((result) => {
            // 将结果转换为字符串，假设结果是一个对象，将其转换为 JSON 字符串
            //const resultString = JSON.stringify(result);
            // console.log(result)
            return result;
        })
        .catch((error) => {
            console.error('Error calling canister:', error);
            throw error; // 将错误继续抛出，以便上层处理
        });
}
