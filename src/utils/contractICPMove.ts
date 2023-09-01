// @ts-ignore
import {AgentCanister, ic} from 'abing258-ic0';

// contract icp 合约调用
export interface ICPService {
    id: string,
    methods: ICPMethod[],
}
export interface ICPMethod {
    name: string,
    args: ICPMethodArg[],
    res: ICPMethodArg[],
    annotation: string
    type: string,
    description: string
}

interface ICPMethodArg {
    name: string | null,
    type: string
}

export class ICPMethodWrapper implements ICPMethod {
    annotation: string;
    args: ICPMethodArg[];
    description: string;
    name: string;
    res: ICPMethodArg[];
    type: string;
    client: AgentCanister

    constructor(method: ICPMethod, client: any) {
        this.annotation = method.annotation
        this.args = method.args
        this.description = method.description
        this.name = method.name
        this.res = method.res
        this.type = method.type
        this.client = client
    }

    call(args: any[]): Promise<any> {

        let callArgs = []
        if(args.length === this.args.length){
            for(let i=0; i< this.args.length; i++){
                if(this.args[i].type === 'nat' || this.args[i].type.indexOf("int") >= 0 ) {
                    callArgs.push(parseFloat(args[i]))
                }else {
                    callArgs.push(args[i])
                }
            }
            return this.client.call(this.name, ...callArgs).then(result => {
                return this.typeUnPackage(result)
            })
        }else {
            throw new Error("args number does not match definition")
        }
    }

    typeUnPackage(data: any): any {
        if(typeof data === "bigint"){
            return Number(data)
        }else return {
            data
        }
    }
}

export class ICPServiceWrapper implements ICPService {
    id: string;
    methods: ICPMethodWrapper[];
    client: AgentCanister

    constructor(svc: ICPService, canisterId: string) {
        this.id = svc.id
        this.client = ic(canisterId)
        this.methods = svc.methods.map(t => new ICPMethodWrapper(t,this.client))
    }
}

export function toICPService(input: any): ICPService[] {

    const services: ICPService[] = []
    for(let svc of input.Services){

        const list : ICPMethod[] = []
        for(let method of svc.Methods){
            const data: ICPMethod = {
                name: method.Name,
                args: [],
                res: [],
                type: "",
                annotation: "",
                description: method.Description
            }


            if(method.Func.Annotation === "query"){
                data.type = "call"
                data.annotation = method.Func.Annotation
            }else {
                data.type = "send"
            }

            if(method.Func.ArgTypes){
                for(let arg of method.Func.ArgTypes){
                    const methodArg : ICPMethodArg = {
                        name: arg.Name,
                        type: arg.Data
                    }
                    data.args.push(methodArg)
                }
            }

            if(method.Func.ResTypes){
                for(let arg of method.Func.ResTypes){
                    let type = ""
                    if(arg.Data.Data){
                        type = arg.Data.Data
                    }else {
                        type = arg.Data
                    }
                    const methodArg : ICPMethodArg = {
                        name: arg.Name,
                        type: type
                    }
                    data.res.push(methodArg)

                }
            }
            list.push(data)
        }

        services.push({
            id: svc.ID === null?"":svc.ID,
            methods: list
        })
    }

    return services
}

export function toDisplay(method: ICPMethod): string {
    const inputArgs = method.args.map(t => t.type).join(",")
    const resArgs: string = method.res.map(t=> t.type).join(",")
    return `(${inputArgs}) -> (${resArgs}) ${method.annotation}`
}


export function getSimpleToDo(): any {
    return  {
        "Definitions": [
            {
                "Id": "ToDo",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "completed",
                        "Data": "bool",
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "description",
                        "Data": "text",
                        "NatData": null,
                        "NameData": null
                    }
                ]
            }
        ],
        "Services": [
            {
                "ID": null,
                "Methods": [
                    {
                        "Name": "addTodo",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "text"
                                }
                            ],
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": "nat"
                                }
                            ],
                            "Annotation": null
                        },
                        "ID": null
                    },
                    {
                        "Name": "clearCompleted",
                        "Func": {
                            "ArgTypes": null,
                            "ResTypes": null,
                            "Annotation": null
                        },
                        "ID": null
                    },
                    {
                        "Name": "completeTodo",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "nat"
                                }
                            ],
                            "ResTypes": null,
                            "Annotation": null
                        },
                        "ID": null
                    },
                    {
                        "Name": "getTodos",
                        "Func": {
                            "ArgTypes": null,
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": {
                                        "Data": "ToDo"
                                    }
                                }
                            ],
                            "Annotation": "query"
                        },
                        "ID": null
                    },
                    {
                        "Name": "showTodos",
                        "Func": {
                            "ArgTypes": null,
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": "text"
                                }
                            ],
                            "Annotation": "query"
                        },
                        "ID": null
                    }
                ],
                "MethodId": null
            }
        ]
    }
}

export function getExample(): any {
    return {
        "Definitions": [
            {
                "Id": "Phone",
                "Data": "text"
            },
            {
                "Id": "Name",
                "Data": "text"
            },
            {
                "Id": "Entry",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "desc",
                        "Data": "text",
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "phone",
                        "Data": null,
                        "NatData": null,
                        "NameData": "Phone"
                    }
                ]
            }
        ],
        "Services": [
            {
                "ID": null,
                "Methods": [
                    {
                        "Name": "insert",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "Name"
                                },
                                {
                                    "Name": null,
                                    "Data": "Entry"
                                }
                            ],
                            "ResTypes": null,
                            "Annotation": null
                        },
                        "ID": null
                    },
                    {
                        "Name": "lookup",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "Name"
                                }
                            ],
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": {
                                        "Data": "Entry"
                                    }
                                }
                            ],
                            "Annotation": "query"
                        },
                        "ID": null
                    }
                ],
                "MethodId": null
            }
        ]
    }
}

export function getCalcDID(): any {
    return {
        "Definitions": null,
        "Services": [
            {
                "ID": null,
                "Methods": [
                    {
                        "Name": "add",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "int"
                                }
                            ],
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": "int"
                                }
                            ],
                            "Annotation": null
                        },
                        "ID": null
                    },
                    {
                        "Name": "clearall",
                        "Func": {
                            "ArgTypes": null,
                            "ResTypes": null,
                            "Annotation": null
                        },
                        "ID": null
                    },
                    {
                        "Name": "div",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "int"
                                }
                            ],
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": {
                                        "Data": "int"
                                    }
                                }
                            ],
                            "Annotation": null
                        },
                        "ID": null
                    },
                    {
                        "Name": "mul",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "int"
                                }
                            ],
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": "int"
                                }
                            ],
                            "Annotation": null
                        },
                        "ID": null
                    },
                    {
                        "Name": "sub",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "int"
                                }
                            ],
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": "int"
                                }
                            ],
                            "Annotation": null
                        },
                        "ID": null
                    }
                ],
                "MethodId": null
            }
        ]
    }
}

export function getBasisDaoDID(): any {
    return {
        "Definitions": [
            {
                "Id": "BasicDaoStableStorage",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "accounts",
                        "Data": {
                            "Data": "Account"
                        },
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "proposals",
                        "Data": {
                            "Data": "Proposal"
                        },
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "system_params",
                        "Data": null,
                        "NatData": null,
                        "NameData": "SystemParams"
                    }
                ]
            },
            {
                "Id": "Tokens",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "amount_e8s",
                        "Data": "nat64",
                        "NatData": null,
                        "NameData": null
                    }
                ]
            },
            {
                "Id": "ProposalState",
                "Data": [
                    {
                        "Nat": null,
                        "Name": null,
                        "Data": null,
                        "NatData": null,
                        "NameData": "Open"
                    },
                    {
                        "Nat": null,
                        "Name": null,
                        "Data": null,
                        "NatData": null,
                        "NameData": "Accepted"
                    },
                    {
                        "Nat": null,
                        "Name": null,
                        "Data": null,
                        "NatData": null,
                        "NameData": "Rejected"
                    },
                    {
                        "Nat": null,
                        "Name": null,
                        "Data": null,
                        "NatData": null,
                        "NameData": "Executing"
                    },
                    {
                        "Nat": null,
                        "Name": null,
                        "Data": null,
                        "NatData": null,
                        "NameData": "Succeeded"
                    },
                    {
                        "Nat": null,
                        "Name": "Failed",
                        "Data": "text",
                        "NatData": null,
                        "NameData": null
                    }
                ]
            },
            {
                "Id": "Proposal",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "id",
                        "Data": "nat64",
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "timestamp",
                        "Data": "nat64",
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "proposer",
                        "Data": {},
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "payload",
                        "Data": null,
                        "NatData": null,
                        "NameData": "ProposalPayload"
                    },
                    {
                        "Nat": null,
                        "Name": "state",
                        "Data": null,
                        "NatData": null,
                        "NameData": "ProposalState"
                    },
                    {
                        "Nat": null,
                        "Name": "votes_yes",
                        "Data": null,
                        "NatData": null,
                        "NameData": "Tokens"
                    },
                    {
                        "Nat": null,
                        "Name": "votes_no",
                        "Data": null,
                        "NatData": null,
                        "NameData": "Tokens"
                    },
                    {
                        "Nat": null,
                        "Name": "voters",
                        "Data": {
                            "Data": {}
                        },
                        "NatData": null,
                        "NameData": null
                    }
                ]
            },
            {
                "Id": "ProposalPayload",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "canister_id",
                        "Data": {},
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "method",
                        "Data": "text",
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "message",
                        "Data": {},
                        "NatData": null,
                        "NameData": null
                    }
                ]
            },
            {
                "Id": "SubmitProposalResult",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "Ok",
                        "Data": "nat64",
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "Err",
                        "Data": "text",
                        "NatData": null,
                        "NameData": null
                    }
                ]
            },
            {
                "Id": "Vote",
                "Data": [
                    {
                        "Nat": null,
                        "Name": null,
                        "Data": null,
                        "NatData": null,
                        "NameData": "Yes"
                    },
                    {
                        "Nat": null,
                        "Name": null,
                        "Data": null,
                        "NatData": null,
                        "NameData": "No"
                    }
                ]
            },
            {
                "Id": "Account",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "owner",
                        "Data": {},
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "tokens",
                        "Data": null,
                        "NatData": null,
                        "NameData": "Tokens"
                    }
                ]
            },
            {
                "Id": "TransferArgs",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "to",
                        "Data": {},
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "amount",
                        "Data": null,
                        "NatData": null,
                        "NameData": "Tokens"
                    }
                ]
            },
            {
                "Id": "TransferResult",
                "Data": [
                    {
                        "Nat": null,
                        "Name": null,
                        "Data": null,
                        "NatData": null,
                        "NameData": "Ok"
                    },
                    {
                        "Nat": null,
                        "Name": "Err",
                        "Data": "text",
                        "NatData": null,
                        "NameData": null
                    }
                ]
            },
            {
                "Id": "VoteArgs",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "proposal_id",
                        "Data": "nat64",
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "vote",
                        "Data": null,
                        "NatData": null,
                        "NameData": "Vote"
                    }
                ]
            },
            {
                "Id": "VoteResult",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "Ok",
                        "Data": null,
                        "NatData": null,
                        "NameData": "ProposalState"
                    },
                    {
                        "Nat": null,
                        "Name": "Err",
                        "Data": "text",
                        "NatData": null,
                        "NameData": null
                    }
                ]
            },
            {
                "Id": "SystemParams",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "transfer_fee",
                        "Data": null,
                        "NatData": null,
                        "NameData": "Tokens"
                    },
                    {
                        "Nat": null,
                        "Name": "proposal_vote_threshold",
                        "Data": null,
                        "NatData": null,
                        "NameData": "Tokens"
                    },
                    {
                        "Nat": null,
                        "Name": "proposal_submission_deposit",
                        "Data": null,
                        "NatData": null,
                        "NameData": "Tokens"
                    }
                ]
            },
            {
                "Id": "UpdateSystemParamsPayload",
                "Data": [
                    {
                        "Nat": null,
                        "Name": "transfer_fee",
                        "Data": {
                            "Data": "Tokens"
                        },
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "proposal_vote_threshold",
                        "Data": {
                            "Data": "Tokens"
                        },
                        "NatData": null,
                        "NameData": null
                    },
                    {
                        "Nat": null,
                        "Name": "proposal_submission_deposit",
                        "Data": {
                            "Data": "Tokens"
                        },
                        "NatData": null,
                        "NameData": null
                    }
                ]
            }
        ],
        "Services": [
            {
                "ID": null,
                "Methods": [
                    {
                        "Name": "get_system_params",
                        "Func": {
                            "ArgTypes": null,
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": "SystemParams"
                                }
                            ],
                            "Annotation": null
                        },
                        "ID": null,
                        "Description": "Get the current system params"
                    },
                    {
                        "Name": "transfer",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "TransferArgs"
                                }
                            ],
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": "TransferResult"
                                }
                            ],
                            "Annotation": null
                        },
                        "ID": null,
                        "Description": "Transfer tokens from the caller's account to another account"
                    },
                    {
                        "Name": "account_balance",
                        "Func": {
                            "ArgTypes": null,
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": "Tokens"
                                }
                            ],
                            "Annotation": "query"
                        },
                        "ID": null,
                        "Description": "Returns the amount of Tokens the caller owns"
                    },
                    {
                        "Name": "list_accounts",
                        "Func": {
                            "ArgTypes": null,
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": {
                                        "Data": "Account"
                                    }
                                }
                            ],
                            "Annotation": "query"
                        },
                        "ID": null,
                        "Description": "Lists all accounts"
                    },
                    {
                        "Name": "submit_proposal",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "ProposalPayload"
                                }
                            ],
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": "SubmitProposalResult"
                                }
                            ],
                            "Annotation": null
                        },
                        "ID": null,
                        "Description": "Submit a proposalA proposal contains a canister ID, method name and method args. If enough usersvote \"yes\" on the proposal, the given method will be called with the given methodargs on the given canister."
                    },
                    {
                        "Name": "get_proposal",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "nat64"
                                }
                            ],
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": {
                                        "Data": "Proposal"
                                    }
                                }
                            ],
                            "Annotation": null
                        },
                        "ID": null,
                        "Description": "Return the proposal with the given ID, if one exists"
                    },
                    {
                        "Name": "list_proposals",
                        "Func": {
                            "ArgTypes": null,
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": {
                                        "Data": "Proposal"
                                    }
                                }
                            ],
                            "Annotation": null
                        },
                        "ID": null,
                        "Description": "Return the list of all proposals"
                    },
                    {
                        "Name": "vote",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "VoteArgs"
                                }
                            ],
                            "ResTypes": [
                                {
                                    "Name": null,
                                    "Data": "VoteResult"
                                }
                            ],
                            "Annotation": null
                        },
                        "ID": null,
                        "Description": "Vote on an open proposal"
                    },
                    {
                        "Name": "update_system_params",
                        "Func": {
                            "ArgTypes": [
                                {
                                    "Name": null,
                                    "Data": "UpdateSystemParamsPayload"
                                }
                            ],
                            "ResTypes": null,
                            "Annotation": null
                        },
                        "ID": null,
                        "Description": "Update system params. Only callable via proposal execution."
                    }
                ],
                "MethodId": null
            }
        ]
    }

}

export function getHelloWorldDID(): any {
    return {
        "Definitions": null,
        "Services": [
            {
                "ID": null,
                "Methods": [
                    {
                        "Name": "main",
                        "Func": {
                            "ArgTypes": null,
                            "ResTypes": null,
                            "Annotation": "oneway"
                        },
                        "ID": null,
                        "Description": ""
                    }
                ],
                "MethodId": null
            }
        ]
    }
}
