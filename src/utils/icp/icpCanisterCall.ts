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
            console.log(result)
            if (typeof result === 'string') {
                return result
            } else if (typeof result === 'object') {
                return JSON.stringify(result)
            } else if (Array.isArray(result)) {
                return JSON.stringify(result)
            } else if (typeof result === 'bigint') {
                return result.toString();
            } else if (typeof result === 'number' || 'boolean') {
                return String(result);
            } else {
                return result.toString();
            }
        })
        .catch((error) => {
            console.error('Error calling canister:', error);
            throw error; // 将错误继续抛出，以便上层处理
        });
}
