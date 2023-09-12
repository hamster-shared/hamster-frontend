import type {ethers} from "ethers";
// @ts-ignore
// @ts-ignore
import {
    CONSTRUCTOR,
    FUNCTION,
    PROXY_CONSTRUCTOR,
    PROXY_UPGRADE,
} from "./types";
import type { DeployRecord,DeployStep,ContractBuild,Step } from './types';
import {ref} from "vue";
import {callContract, deployContract, deployProxyContract, upgradeProxyContract} from "./upgrade";


export class NewEngine {
    private readonly provider:ethers.providers.Web3Provider;
    public isRunning: boolean = false;
    constructor(provider:ethers.providers.Web3Provider) {
        this.provider = provider;
    }

    public async start(abiMap:Map<string,ContractBuild>,deployInfo:DeployRecord) {
        if (this.isRunning) {
            console.log("Workflow is already running.");
            return;
        }

        this.isRunning = true;
        await this.run(abiMap,deployInfo);
    }

    async run(abiMap : Map<string,ContractBuild>,deployInfo: DeployRecord) {
        if (deployInfo.step >= deployInfo.deployStep.length || !this.isRunning) {
            return;
        }
        console.log(deployInfo);
        let deployStep = deployInfo.deployStep[deployInfo.step]
        if (deployStep.step >= deployStep.steps.length) {
            return;
        }
        const contractBuild = abiMap.get(deployStep.Contract.name)
        if(contractBuild === undefined){
            throw new Error(`cannot find contract ${deployStep.Contract.name} `)
        }
        let abi = contractBuild.abi
        let bytecode = contractBuild.bytecode
        console.log(bytecode)
        console.log(deployStep.step)
        console.log(deployStep.steps.length)
        for (let stepIndexInStep = deployStep.step;stepIndexInStep < deployStep.steps.length; stepIndexInStep++) {
            if (!this.isRunning) {
                return;
            }
            const step = deployStep.steps[stepIndexInStep];
            console.log(step.type);
            if(step.type === CONSTRUCTOR){
                if (!this.isRunning) {
                    step.status = "STOP"
                    deployStep.status = "STOP"
                    return;
                }
                if (step.status == "RUNNING") {

                }
                step.status = "RUNNING"
                deployStep.status = "RUNNING"
                //todo 保存状态数据

                try {
                    const params = this.paramReplace(step.params,deployInfo.deployStep)
                    const deployTransactionResponse= await deployContract(this.provider,abi, bytecode, ...params)
                    deployStep.Contract.address = deployTransactionResponse.contractAddress
                    step.transactionHash = deployTransactionResponse.transactionHash
                    step.status = "SUCCESS"
                    deployStep.status = "SUCCESS"
                    console.log("construction function is success")
                }catch (e) {
                    step.status = "FAIL"
                    deployStep.status = "FAIL"
                    this.isRunning = false
                    console.log(e)
                    return
                }
            } else if(step.type === FUNCTION){
                if (!this.isRunning) {
                    step.status = "STOP"
                    deployStep.status = "STOP"
                    return;
                }
                const params = this.paramReplace(step.params,deployInfo.deployStep)
                try {
                    const tx = await callContract(this.provider, abi, deployStep.Contract.address, step.method, ...params)
                    console.log(tx)
                    step.transactionHash = tx.hash
                    step.status = "SUCCESS"
                    deployStep.status = "SUCCESS"
                    console.log("FUNCTION function is success")
                }catch (e) {
                    step.status = "FAIL"
                    deployStep.status = "FAIL"
                    this.isRunning = false
                    console.log(e)
                    return
                }
            } else if(step.type === PROXY_CONSTRUCTOR){
                console.log(5555555);
                if (!this.isRunning) {
                    step.status = "STOP"
                    deployStep.status = "STOP"
                    return;
                }
                const params = this.paramReplace(step.params,deployInfo.deployStep)
                try {
                    const deployTransactionResponse = await deployProxyContract(this.provider, abi, bytecode,step.method, params)
                    deployStep.Contract.address = deployTransactionResponse.contractAddress
                    step.transactionHash = deployTransactionResponse.transactionHash
                    step.status = "SUCCESS"
                    deployStep.status = "SUCCESS"
                    console.log("FUNCTION function is success")
                }catch (e){
                    console.log(e)
                    step.status = "FAIL"
                    deployStep.status = "FAIL"
                    this.isRunning = false
                    return
                }
            }else if(step.type === PROXY_UPGRADE) {
                if (!this.isRunning) {
                    step.status = "STOP"
                    deployStep.status = "STOP"
                    return;
                }
                const params = this.paramReplace(step.params,deployInfo.deployStep)
                try {
                    deployStep.Contract.address = await upgradeProxyContract(this.provider, abi, bytecode,step.method, params,deployStep.Contract.address)
                    step.status = "SUCCESS"
                    deployStep.status = "SUCCESS"
                }catch (e){
                    console.log(e)
                    step.status = "FAIL"
                    deployStep.status = "FAIL"
                    this.isRunning = false
                    return
                }
            }
            deployStep.step = stepIndexInStep + 1
        }
        deployInfo.step = deployInfo.step + 1
        await this.run(abiMap,deployInfo);
    }


    paramReplace(params: string[],deployInfo:  DeployStep[]) {
        if(params.length === 0 ){
            return params
        }
        for(let i = 0 ; i< params.length; i++){
            if (params[i].startsWith("$")){
                let contractName = params[i].substring(1).split(".")[0]
                let attr = params[i].substring(1).split(".")[1]
                let deploy = deployInfo.find((t: DeployStep) => t.Contract.name === contractName)
                if(deploy === undefined){
                    continue
                }
                params[i] = deploy.Contract[attr]
            }
        }
        return params
    }

    public stop(): void {
        this.isRunning = false;
        console.log("Workflow has been stopped.");
    }


}