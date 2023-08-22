// contract icp 合约调用
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

export function toICPMethod(input: any): ICPMethod[] {

    const list : ICPMethod[] = []
    for(let svc of input.Services){
        for(let method of svc.Methods){
            const data: ICPMethod = {
                name: method.Name,
                args: [],
                res: [],
                type: "",
                annotation: "",
                description: ""
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
    }

    return list
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
