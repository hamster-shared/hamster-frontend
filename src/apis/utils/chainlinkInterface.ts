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
    subscriptionId?:string;
    admin?:string;
    transactionTx?:string;
    status?:string;
    name?:string;
}
// 给订阅号添加消费者参数
export interface consumerAddParams {
    subscription_id?:string;
    consumer_address?:string;
    transaction_tx?:string;
}
// 订阅号充值参数
export interface payFundParams {
    consumerAddress:string;
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