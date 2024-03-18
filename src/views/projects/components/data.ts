interface RecentBuildItem {
  id: string,
  startTime: string,
  status: number,
  version: string,
  workflowId: string,
}
interface RecentCheckItem {
  id: string,
  startTime: string,
  status: number,
  workflowId: string,
}

export interface RecentDeployItem {
  id: string,
  status: number,
  version: string,
  startTime: string,
  workflowId: string,
  deployTime: string,
  packageId: number,
}

export interface ViewInfoItem {
  id: string,
  branch: string,
  frameType: number,
  name: string,
  repositoryUrl: string,
  type: string,
  userId: number,
  deployType: number,
  recentBuild: RecentBuildItem,
  recentCheck: RecentCheckItem,
  recentDeploy:RecentDeployItem,
  labelDisplay:string | undefined,
  allBranch: string[],
}

interface AbiInfoDataInputsItem {
  internalType: string,
  name: string,
  type: string,
}

interface AbiInfoDataOutputsItem {
  internalType: string,
  name: string,
  type: string,
}

export interface AbiInfoDataItem {
  inputs: AbiInfoDataInputsItem,
  stateMutability: string,
  name: string,
  type: string,
  outputs: AbiInfoDataOutputsItem,
  anonymous: boolean,
}
