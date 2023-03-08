interface RecentBuildItem {
  id: number,
  startTime: string,
  status: number,
  version: string,
  workflowId: number,
}

interface RecentCheckItem {
  id: number,
  startTime: string,
  status: number,
  workflowId: number,
}

interface RecentDeployItem {
  id: number,
  status: number,
  workflowId: number,
  deployTime: string,
}

export interface ViewInfoItem {
  id: string,
  branch: string,
  frameType: number,
  name: string,
  repositoryUrl: string,
  type: number,
  userId: number,
  recentBuild: RecentBuildItem,
  recentCheck: RecentCheckItem,
  recentDeploy:RecentDeployItem,
}