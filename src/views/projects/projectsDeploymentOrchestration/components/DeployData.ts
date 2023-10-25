import type {ContractInterface} from "@ethersproject/contracts/src.ts";
export type StepActionType = string
export const CONSTRUCTOR: StepActionType = "constructor"
export const FUNCTION: StepActionType = "function"
export const PROXY_CONSTRUCTOR: StepActionType = "proxyConstructor"  //---》开启了proxy---》type:proxyConstructor
export const PROXY_UPGRADE: StepActionType = "proxyUpgrade"

export interface DeployRecord {
  deployStep: DeployStep[]
  step: number
}

export interface DeployStep {
  contract: ContractInfo,
  steps: Step[]
  status: string
  step: number
}
export interface ContractInfo {
  name: string,
  address: string,
  proxyAddress: string,
  proxy: boolean,
}
export interface Step {
  contractName?: string
  type: StepActionType, //
  method: string
  params: string[]
  status: string, //PENDDING,SUCCESS,FAIL
  transactionHash?: string,
  value?: string
}

export interface ContractBuild {
  id: number
  abi: ContractInterface
  bytecode: string
}
export interface DeployParams {
  projectId:string
  execId: number
  version:string
  network:string
}