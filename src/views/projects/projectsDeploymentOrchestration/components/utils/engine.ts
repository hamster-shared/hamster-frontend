import type {ethers} from "ethers";
import {
    CONSTRUCTOR,
    FUNCTION,
    PROXY_CONSTRUCTOR,
    PROXY_UPGRADE,
} from "../DeployData";
import type { DeployRecord,DeployStep,ContractBuild,DeployParams} from '../DeployData';
import {callContract, deployContract, deployProxyContract, getTransaction, upgradeProxyContract} from "./evm";
import {apiUpdateExecuteInfo} from "@/apis/contractOrchestrationDeploy";
import {apiProjectsContractDeploy} from "@/apis/projects";



export default class NewEngine {
    private readonly provider:ethers.providers.Web3Provider;
    public isRunning: boolean = false;
    constructor(provider:ethers.providers.Web3Provider) {
        this.provider = provider;
    }

    public async start(abiMap:Map<string,ContractBuild>,deployInfo:DeployRecord,deployParams:DeployParams) {
        if (this.isRunning) {
            console.log("Workflow is already running.");
            return;
        }

        this.isRunning = true;
        await this.run(abiMap,deployInfo,deployParams);
    }

    async run(abiMap : Map<string,ContractBuild>,deployInfo: DeployRecord,deployParams:DeployParams) {
        if (deployInfo.step >= deployInfo.deployStep.length) {
            console.info("exec finished")
            return;
        }
        let deployStep = deployInfo.deployStep[deployInfo.step]
        if (deployStep.step >= deployStep.steps.length) {
            return;
        }
        const contractBuild = abiMap.get(deployStep.contract.name)
        if(contractBuild === undefined){
            throw new Error(`cannot find contract ${deployStep.contract.name} `)
        }
        let abi = contractBuild.abi
        let bytecode = contractBuild.bytecode
        for (let stepIndexInStep = deployStep.step;stepIndexInStep < deployStep.steps.length; stepIndexInStep++) {
            const step = deployStep.steps[stepIndexInStep];
            if (!this.isRunning) {
                step.status = "STOP"
                deployStep.status = "STOP"
                await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
                return;
            }
            if (step.status == "RUNNING") {
                if (step.transactionHash != "" || step.transactionHash != undefined) {
                    const receipt = await getTransaction(step.transactionHash,deployParams.rpcUrl)
                    if (receipt.status == 0 || receipt.status == undefined ) {
                        step.status = "FAILED"
                        deployStep.status = "FAILED"
                        this.isRunning = false
                        // save exec status
                        await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
                        return
                    }
                    if (step.type == CONSTRUCTOR || step.type == PROXY_CONSTRUCTOR) {
                        // save contract deploy info
                        await saveContractDeployInfo(deployParams.projectId,contractBuild.id,deployParams.version,deployParams.network,receipt.contractAddress,step.transactionHash)
                        deployStep.Contract.address = receipt.contractAddress
                    }
                    step.status = "SUCCESS"
                    deployStep.status = "SUCCESS"
                    // save exec status
                    await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
                    deployStep.step = stepIndexInStep + 1
                    continue
                }
            }
            step.status = "RUNNING"
            deployStep.status = "RUNNING"
            await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
            if(step.type === CONSTRUCTOR){
                try {
                    const params = this.paramReplace(step.params,deployInfo.deployStep)
                    const deployTransactionResponse= await deployContract(this.provider,abi, bytecode, ...params)
                    // save contract deploy info
                    await saveContractDeployInfo(deployParams.projectId,contractBuild.id,deployParams.version,deployParams.network,deployTransactionResponse.contractAddress,deployTransactionResponse.transactionHash)
                    deployStep.Contract.address = deployTransactionResponse.contractAddress
                    step.transactionHash = deployTransactionResponse.transactionHash
                    step.status = "SUCCESS"
                    deployStep.status = "SUCCESS"
                    // save exec status
                    await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
                }catch (e) {
                    step.status = "FAILED"
                    deployStep.status = "FAILED"
                    this.isRunning = false
                    // save exec status
                    await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
                    return
                }
            } else if(step.type === FUNCTION){
                console.log(step.method)
                const params = this.paramReplace(step.params,deployInfo.deployStep)
                try {
                    let  contractAddress = deployStep.Contract.address
                    if (step.contractName != deployStep.Contract.name) {
                        const contractInfo = abiMap.get(step.contractName)
                        if(contractInfo === undefined){
                            throw new Error(`cannot find contract ${deployStep.Contract.name} `)
                        }
                        abi = contractInfo.abi
                        contractAddress = this.getContractAddress(step.contractName,deployInfo.deployStep)
                        if (contractAddress === "") {
                            throw new Error(`cannot find contract address,contract name is: ${step.contractName} `)
                        }
                    }
                    const tx = await callContract(this.provider, abi, contractAddress, step.method,step.value, ...params)
                    console.log(tx)
                    step.transactionHash = tx.hash
                    step.status = "SUCCESS"
                    deployStep.status = "SUCCESS"
                    // save exec status
                    await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
                    console.log("FUNCTION function is success")
                }catch (e) {
                    step.status = "FAILED"
                    deployStep.status = "FAILED"
                    this.isRunning = false
                    // save exec status
                    await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
                    console.log(e)
                    return
                }
            } else if(step.type === PROXY_CONSTRUCTOR){
                const params = this.paramReplace(step.params,deployInfo.deployStep)
                try {
                    const deployTransactionResponse = await deployProxyContract(this.provider, abi, bytecode,step.method, params)
                    // save contract deploy info
                    await saveContractDeployInfo(deployParams.projectId,contractBuild.id,deployParams.version,deployParams.network,deployTransactionResponse.contractAddress,deployTransactionResponse.transactionHash)
                    deployStep.Contract.address = deployTransactionResponse.contractAddress
                    step.transactionHash = deployTransactionResponse.transactionHash
                    step.status = "SUCCESS"
                    deployStep.status = "SUCCESS"
                    // save exec status
                    await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
                    console.log("FUNCTION function is success")
                }catch (e){
                    step.status = "FAILED"
                    deployStep.status = "FAILED"
                    this.isRunning = false
                    // save exec status
                    await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
                    return
                }
            }else if(step.type === PROXY_UPGRADE) {
                const params = this.paramReplace(step.params,deployInfo.deployStep)
                try {
                    const data = await upgradeProxyContract(this.provider, abi, bytecode,step.method, params,deployStep.Contract.proxyAddress)
                    deployStep.Contract.address = data.address
                    // save contract deploy info
                    await saveContractDeployInfo(deployParams.projectId,contractBuild.id,deployParams.version,deployParams.network,data.address,data.transactionData.transactionHash)
                    step.status = "SUCCESS"
                    deployStep.status = "SUCCESS"
                    // save exec status
                    await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
                }catch (e){
                    console.log(e)
                    step.status = "FAILED"
                    deployStep.status = "FAILED"
                    this.isRunning = false
                    // save exec status
                    await saveDeployExec(deployParams.projectId,deployParams.execId,JSON.stringify(deployInfo))
                    return
                }
            }
            deployStep.step = stepIndexInStep + 1
        }
        deployInfo.step = deployInfo.step + 1
        await this.run(abiMap,deployInfo,deployParams);
    }


    paramReplace(params: string[],deployInfo:  DeployStep[]) {
        if(params.length === 0 ){
            return params
        }
        for(let i = 0 ; i< params.length; i++){
            if (typeof params[i] === "string") {
                if (params[i].startsWith("$")){
                    let contractName = params[i].substring(1).split(".")[0]
                    let attr = params[i].substring(1).split(".")[1]
                    let deploy = deployInfo.find((t: DeployStep) => contractName.includes(t.contract.name))
                    if(deploy === undefined){
                        continue
                    }
                    params[i] = deploy.Contract[attr]
                }
            }
        }
        return params
    }

    getContractAddress(contractName:string,deployInfo:  DeployStep[]) {
        let contractAddress = ""
        for (let deployStep of deployInfo) {
            if (contractName === deployStep.Contract.name) {
                contractAddress = deployStep.Contract.address
                break
            }
        }
        return contractAddress
    }

    public stop(): void {
        this.isRunning = false;
        console.log("Workflow has been stopped.");
    }
}

export function formatContractList(contractData:any) {
    const dataMap = new Map<String, ContractBuild>();
    contractData.forEach(item => {
        let contractBuild:ContractBuild = {
            id: item.id,
            abi: item.abiInfo,
            bytecode:item.byteCode
        }
        dataMap.set(item.name, contractBuild);
    });
    return dataMap;
}

async function saveDeployExec(projectId:string,execId:number,jsonData:string) {
    let data = {
        id: execId,
        arrangeProcessData: jsonData,
    }
    await apiUpdateExecuteInfo(projectId,data)
}

async function saveContractDeployInfo(projectId:string,contractId:number,version:string,network:string,address:string,hash:string) {
    let data = {
        contractId: contractId,
        projectId: projectId,
        version: version,
        network: network,
        address: address,
        deployTxHash: hash,
    }
    await apiProjectsContractDeploy(data)
}