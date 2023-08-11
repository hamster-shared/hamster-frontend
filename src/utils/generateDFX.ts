// 生成dfx.json文件
export const generateDFX = (name: any, type: any, source: string) => {
  return {
    "canisters": {
      [name]: {
        "type": type,
        "source": [source],
        "frontend": {}
      }
    }
  }
}

interface CanisterJson {
  canisters: CanisterMap
}

interface CanisterMap {
  [key: string]: Canister
}

interface Canister {
  type: string;
  source: string[];
  frontend: any
}

export const parseCanisterJson = (json: string): Promise<CanisterJson> => {
  return new Promise((resolve, reject) => {
    let obj = JSON.parse(json)
    try {
      const realData: CanisterJson = obj as CanisterJson
      resolve(realData)
    } catch (e) {
      reject(e)
    }
  })
}

interface ResolveResult {
  name: string,
  type: string,
  source: string,
}

/*
    将dfx.json 文件内，解析成 name,type,source
 */
export const parseDFX = (json: string): Promise<ResolveResult> => {
  return parseCanisterJson(json).then((canisterJson) => {
    const name = getFirstKeyFromMap(canisterJson.canisters)
    if (name === undefined) {
      throw new Error("DFX.json format error!")
    }
    const canister = canisterJson.canisters[name]
    if (canister === undefined) {
      throw new Error("DFX.json format error!")
    }
    return {
      name: name,
      type: canister.type,
      source: canister.source.length >= 0 ? canister.source[0] : "",
    }
  })
}

// 生成contract 的 dfx.json文件
export const generateContractDFX = (name: any, type: any, mian?: string) => {
  return {
    "canisters": {
      [name]: {
        "type": type,
        "main": mian,
      }
    }
  }
}

interface ContractCanisterJson {
  canisters: ContractCanisterMap
}

interface ContractCanisterMap {
  [key: string]: ContractCanister
}

interface ContractCanister {
  type: string;
  main: string;
}

export const parseContractCanisterJson = (json: string): Promise<ContractCanisterJson> => {
  return new Promise((resolve, reject) => {
    let obj = JSON.parse(json)
    try {
      const realData: ContractCanisterMap = obj as ContractCanisterMap
      resolve(realData)
    } catch (e) {
      reject(e)
    }
  })
}
interface ResolveContractResult {
  name: string,
  type: string,
  main: string,
}

/*
    将dfx.json 文件内，解析成 name,type,main
 */
export const parseContractDFX = (json: string): Promise<ResolveContractResult> => {
  return parseContractCanisterJson(json).then((ContractCanisterJson) => {
    const name = getFirstKeyFromMap(ContractCanisterJson.canisters)
    if (name === undefined) {
      throw new Error("DFX.json format error!")
    }
    const canister = ContractCanisterJson.canisters[name]
    if (canister === undefined) {
      throw new Error("DFX.json format error!")
    }
    return {
      name: name,
      type: canister.type,
      main: canister.main,
    }
  })
}


function getFirstKeyFromMap(map: Object): string | undefined {
  for (const key of Object.keys(map)) {
    return key; // 返回第一个key
  }
  return undefined; // 如果Map为空，返回undefined
}
