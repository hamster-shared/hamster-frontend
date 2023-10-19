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
  Contract: ContractInfo,
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
  contractName: string
  type: StepActionType, //
  method: string
  params: string[]
  status: string, //PENDDING,SUCCESS,FAIL
  transactionHash: string,
  value: string
}