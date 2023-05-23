import type {ContractInterface} from "@ethersproject/contracts/src.ts";
export interface DeployStep {
    Contract: ContractInfo,
    steps: Step[]
}
export interface ContractInfo {
    name: string,
    address: string,
    proxy: boolean,
}

export type StepActionType = string
export const CONSTRUCTOR:StepActionType  = "constructor"
export const FUNCTION: StepActionType = "function"
export const PROXY_CONSTRUCTOR: StepActionType = "proxyConstructor"
export const PROXY_UPGRADE: StepActionType = "proxyUpgrade"

export interface Step {
    type: StepActionType, //
    method: string
    params: string[]
    status: string, //PENDDING,SUCCESS,FAIL
}

export interface ContractBuild {
    abi: ContractInterface
    bytecode: string
}
