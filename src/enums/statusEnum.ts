export enum WorkflowStatusEnum {
  "nonExecution",
  "running",
  "failed",
  "success",
  "stop",
}
export enum WorkflowStagSvgEnum {
  "nonExecution",
  "running",
  "fail",
  "success",
  "stop",
}

export enum WorkflowStepSvgEnum {
  "nonExecution-step",
  "Running-step",
  "Fail-step",
  "Success-step",
  "Stop-step",
}

export enum BuildStatusEnum {
}

export enum NodeStatusEnum {
  'Initializing' = 1,
  'Launching' = 2,
  'Syncing' = 3,
  'Synced' = 4,
  'Halted' = 5,
}

export enum OrderStatusEnum {
  'PaymentPending' = 1,
  'Paid' = 2,
  'Cancelled' = 3,
  'RefundPending' = 4,
  'Refund' = 5,
  'Dispute' = 6
}
export enum OrderTypeEnum {
  'Hamster Node Service'
}