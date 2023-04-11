// 订阅列表参数
export interface sublistParams {
    page:number;
    size:number;
    network?:string
}
// 创建订阅参数
export interface createSubParams {
    chain?:string;
    network?:string;
    subscriptionId?:string | number;
    admin?:string | null;
    transactionTx?:string;
    name?:string;
}
// 给订阅号添加消费者参数
export interface consumerAddParams {
    subscriptionId?:string|number;
    consumerAddress?:string;
    transactionTx?:string;
}
// 订阅号充值参数
export interface payFundParams {
    transactionTx:string;
    incr?:string;
}
// expense 列表参数
export interface expenseListParams {
    page:number;
    size:number;
    requestName?:string;
}
// deposit 列表参数
export interface depositListParams {
    page:number;
    size:number;
}
// consumer 列表参数
export interface consumerListParams {
    page:number;
    size:number;
}
// 创建消费者弹框里面的表格参数
export interface consumerInTableParams {
    chain:string,
    network:string,
    page:number;
    size:number;
}
// oracle table 列表参数
export interface oracleTableParams {
    page: number;
    size: number;
    token: string | null;
}
// 修改订阅状态参数
export interface updateSubParams {
    id:number|undefined,
    chain?:string;
    network?:string;
    chainSubscriptionId?:string | number;
    transactionTx?:string;
    newStatus?:string;
}

// 获取subscription概览
export interface getSubscriptionParams {
    network: string;
    token: string | null
}
//创建request
export interface createRequestParams {
    name: string;
    script: string
}
//修改消费者状态参数
export interface updateConsumerParams {
    id:number;
    subscriptionId:number;
    transactionTx: string;
    newStatus:string;
}
// 测试订阅的参数
export interface ExecSubParams {
    subscriptionId?:number;
    secretsloction?:number;
    secretUrl?:string;
    args?:string;
    requestName?:string;
    requestId?:string;
    amount?:number;
    transactionTx?: string;
    consumerAddress?: string;
    network?:string;
}
// 更新测试订阅参数
export interface updateTestSubParams {
    requestId?:string;
    network?:string;
    paramsCount: string | number
}