import {ContractFactory, ethers, Signer} from "ethers";
import { keccak256,toChecksumAddress } from 'ethereumjs-util';
import type {ContractInterface} from "@ethersproject/contracts/src.ts";
import type {BytesLike} from "@ethersproject/bytes";
import {getContractAddress} from "ethers/lib/utils";
import {ERC1967_ABI, ERC1967_BYTECODE, JSON_PRC} from "./types";
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface TransactionInfo {
    transactionHash: string,
    block: number,
    timeStamp: string,
    from:string,
    to:string,
    value:string,
    transactionFee:string,
    gasPrice:string
}
export async function getStorageAt(
    provider: ethers.providers.Web3Provider,
    address: string,
    position: string,
    block = 'latest',
): Promise<string> {
    const storage = await provider.send('eth_getStorageAt', [address, position, block]);
    const padded = storage.replace(/^0x/, '').padStart(64, '0');
    return '0x' + padded;
}

export async function getCode(provider: ethers.providers.Web3Provider, address: string, block = 'latest'): Promise<string> {
    return provider.send('eth_getCode', [address, block]);
}

async function getStorageFallback(provider: ethers.providers.Web3Provider, address: string, ...slots: string[]): Promise<string> {
    let storage = '0x0000000000000000000000000000000000000000000000000000000000000000'; // default: empty slot

    for (const slot of slots) {
        storage = await getStorageAt(provider, address, slot);
        if (!isEmptySlot(storage)) {
            break;
        }
    }

    return storage;
}

export function toFallbackEip1967Hash(label: string): string {
    return '0x' + keccak256(Buffer.from(label)).toString('hex');
}

export function toEip1967Hash(label: string): string {
    const hash = keccak256(Buffer.from(label));
    const bigNumber = BigInt('0x' + hash.toString('hex')) - 1n;
    return '0x' + bigNumber.toString(16);
}

export function isEmptySlot(storage: string): boolean {
    return BigInt(storage.replace(/^(0x)?/, '0x')) === 0n;
}

function parseAddressFromStorage(storage: string): string {
    const address = parseAddress(storage);
    if (address === undefined) {
        throw new Error(`Value in storage is not an address (${storage})`);
    }
    return address;
}


export async function getAdminAddress(provider: ethers.providers.Web3Provider, address: string): Promise<string> {
    const storage = await getStorageFallback(
        provider,
        address,
        toEip1967Hash('eip1967.proxy.admin'),
        toFallbackEip1967Hash('org.zeppelinos.proxy.admin'),
    );

    return parseAddressFromStorage(storage);
}

export function parseAddress(addressString: string): string | undefined {
    const buf = Buffer.from(addressString.replace(/^0x/, ''), 'hex');
    if (!buf.slice(0, 12).equals(Buffer.alloc(12, 0))) {
        return undefined;
    }
    const address = '0x' + buf.toString('hex', 12, 32); // grab the last 20 bytes
    return toChecksumAddress(address);
}


export async function getITransparentUpgradeableProxyFactory(
    signer?: Signer,
): Promise<ContractFactory> {
    const ITransparentUpgradeableProxyAbi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "previousAdmin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "newAdmin",
                    "type": "address"
                }
            ],
            "name": "AdminChanged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "beacon",
                    "type": "address"
                }
            ],
            "name": "BeaconUpgraded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "implementation",
                    "type": "address"
                }
            ],
            "name": "Upgraded",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "admin",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "changeAdmin",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "implementation",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "upgradeTo",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "bytes",
                    "name": "",
                    "type": "bytes"
                }
            ],
            "name": "upgradeToAndCall",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
    ]
    console.log('ITransparentUpgradeableProxy:',ITransparentUpgradeableProxyAbi)
    return new ethers.ContractFactory(ITransparentUpgradeableProxyAbi, '0x', signer);
}

export async function deployContract(provider:ethers.providers.Web3Provider,abi: ContractInterface, bytecode: BytesLike | { object: string }, ...args: Array<any>) {
    const signer = provider.getSigner()
    let factory = new ethers.ContractFactory(abi,bytecode,signer)
    const contract = await factory.deploy(...args)
    const deployTransactionResponse = await contract.deployTransaction.wait();
    console.log(deployTransactionResponse);
    console.log(contract.address)
    return deployTransactionResponse
}


export async function callContract (provider:ethers.providers.Web3Provider, abi: ContractInterface, address: string, method: string , ...params : Array<any>)  {
    const signer = provider.getSigner()
    const contract = new ethers.Contract(address, abi, signer);
    const tx = await contract[method](...params)
    await tx.wait()
    return tx
}


export async function deployProxyContract(provider: ethers.providers.Web3Provider, abi: ContractInterface, bytecode: BytesLike | { object: string }, initializeMethod: string|"initialize", args: string[]) {
    const signer = provider.getSigner()
    let factory = new ethers.ContractFactory(abi,bytecode,signer)
    const contract = await factory.deploy()
    await contract.deployTransaction.wait();
    if(initializeMethod === ""){
        initializeMethod = "initialize"
    }
    const fragment = factory.interface.getFunction(initializeMethod)
    const data =  factory.interface.encodeFunctionData(fragment,args)
    const ProxyFactory =  new ethers.ContractFactory(ERC1967_ABI,ERC1967_BYTECODE,signer)
    const proxyInstance = await ProxyFactory.deploy(contract.address,data)
    const deployTransactionInfo = await proxyInstance.deployTransaction.wait();

    const address = getContractAddress({
        from: await factory.signer.getAddress(),
        nonce: proxyInstance.deployTransaction.nonce,
    })
    console.log(deployTransactionInfo)
    console.log("getContractAddress: ", address)

    return deployTransactionInfo
}


export async function upgradeProxyContract(provider: ethers.providers.Web3Provider, abi: ContractInterface, bytecode: BytesLike | { object: string }, initializeMethod: string|"initialize", args: string[], proxyAddress: string) {
    const signer = provider.getSigner()
    let factory = new ethers.ContractFactory(abi,bytecode,signer)
    const contract = await factory.deploy()
    await contract.deployTransaction.wait();
    if(initializeMethod === ""){
        initializeMethod = "initialize"
    }
    const fragment = factory.interface.getFunction(initializeMethod)
    const data =  factory.interface.encodeFunctionData(fragment,args)
    //TODO ...
    //
    const adminAddress = await getAdminAddress(provider,proxyAddress)
    const adminBytecode = await getCode(provider, adminAddress);

    if (isEmptySlot(adminAddress) || adminBytecode === '0x') {
        console.log('ITransparentUpgradeableProxyFactory')
        const ITransparentUpgradeableProxyFactory = await getITransparentUpgradeableProxyFactory(signer);
        const proxy = ITransparentUpgradeableProxyFactory.attach(proxyAddress);
        const tx = await proxy.upgradeTo(contract.address)
        console.log(tx)
        console.log('upgrade success')
    }else{
        console.log('AdminFactory')
    }
    console.log("adminAddress:", adminAddress)
    // const adminBytecode = await getCode(provider, adminAddress);
    //
    // const AdminFactory = new ethers.ContractFactory(ProxyAdmin.abi, ProxyAdmin.bytecode, signer)
    // const admin = AdminFactory.attach(adminAddress);
    // const manifestAddress = await signer.getAddress()
    // if(admin.address !== manifestAddress){
    //     throw new Error('Proxy admin is not the one registered in the network manifest');
    // }
    //
    // const tx = await admin.upgrade(proxyAddress,contract.address)
    // await tx.wait()
    return proxyAddress
}




export async function getTransactionInfo(transactionHash: string):Promise<TransactionInfo> {
    return new Promise<TransactionInfo>(async (resolve, reject) => {
        let transactionInfo:TransactionInfo = {
            transactionHash: '',
            block:0,
            timeStamp:'',
            from:'',
            to:"",
            value:'',
            transactionFee:'',
            gasPrice:''
        }
        transactionInfo.transactionHash = transactionHash;
        const provider = new ethers.providers.JsonRpcProvider(JSON_PRC)
        const transaction = await provider.getTransaction(transactionHash);
        const blockInfo = await provider.getBlock(<number>transaction.blockNumber)
        const date = utcToZonedTime(new Date(blockInfo.timestamp * 1000), 'UTC');
        transactionInfo.timeStamp = format(date, "MMM-dd-yyyy hh:mm:ss a xxx", { timeZone: "UTC" })
        transactionInfo.value = ethers.utils.formatEther(transaction.value) + "ETH";
        transactionInfo.from = transaction.from
        transactionInfo.block = <number>transaction.blockNumber
        transactionInfo.gasPrice = ethers.utils.formatUnits(transaction.gasPrice._hex, 'gwei') + "Gwei"
        const receipt = await provider.getTransactionReceipt(transactionHash);
        transactionInfo.to = receipt.to
        const gasCost = receipt.gasUsed;
        const gasPriceWei = transaction.gasPrice;
        const transactionFeeWei = gasCost.mul(gasPriceWei._hex);
        transactionInfo.transactionFee = ethers.utils.formatEther(transactionFeeWei) + "ETH"
        resolve(transactionInfo)
    });
}