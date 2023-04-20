<template>
  <Breadcrumb :currentName="projectName" :isClick="loading">
    <template v-slot:tags>
      <span
          class="dark:text-white text-[#151210] text-[14px] px-[16px] py-[6px] ml-[16px] border border-solid border-[#EBEBEB] rounded-[32px]">
        {{ ContractFrameTypeEnum[frameType] }}
      </span>
    </template>
  </Breadcrumb>
  <div
      class="artifactsDeploy dark:bg-[#1D1C1A] bg-[#FFFFFF] dark:text-white text-[#121211]  p-[32px] rounded-[12px] mt-[24px]">
    <div class="grid grid-cols-5 gap-4">
      <a-form class="dark:text-white text-[#121211] col-span-3" ref="formRef" :model="formState" name="basic"
              :label-col="{ span: 0 }" :wrapper-col="{ span: 18 }" autocomplete="off" noStyle>
        <div class="text-[16px] font-bold mb-[16px]">Contract</div>
        <a-form-item class="" name="version" :rules="[{ required: true, message: 'Please input your Version!' }]">
          <div class="dark:text-white text-[#121211] mb-[12px]">Version</div>
          <a-select v-model:value="formState.version" style="width: 100%" placeholder="请选择" @change="changeVersion">
            <a-select-option :value="item" v-for="item in versionData" :key="item">{{
                item
              }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="nameData" class="name-item" :rules="[{ required: true, message: 'Please input your Name!' }]">
          <div class="dark:text-white text-[#121211] mb-[12px]">Name</div>
          <a-checkbox-group class="dark:text-white text-[#121211] w-full"
                            :class="theme.themeValue === 'dark' ? 'dark-css' : ''" v-model:value="formState.nameData"
                            name="checkboxgroup">
            <div v-for="(val, index) in projectsContractData" :key="val.id"
                 class="w-full flex justify-between border border-solid dark:border-[#434343] border-[#EFEFEF] rounded-[8px] px-[12px] py-[9px] mb-[16px]">
              <a-checkbox :value="val" :disabled="val.hasModalFormData">{{ val.name }}</a-checkbox>
              <img src="@/assets/icons/cname.svg" class="cursor-pointer" v-show="val.hasArgument"
                   @click="selectAargumentName(val, index)" />
            </div>
          </a-checkbox-group>


        </a-form-item>

        <div class="text-[16px] font-bold mb-[16px]">Network / Chain</div>
        <a-form-item name="chain" :rules="[{ required: true, message: 'Please input your Chain!' }]">
          <div class="dark:text-white text-[#121211] mb-[12px]">Chain</div>
          <a-select v-model:value="formState.chain" style="width: 100%" placeholder="Please select" @change="changeChain">
            <a-select-option :value="item" v-for="item in chainData" :key="item">{{
                item
              }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="network" :rules="[{ required: true, message: 'Please input your Network!' }]">
          <div class="dark:text-white text-[#121211] mb-[12px]">Network</div>
          <a-select v-model:value="formState.network" style="width: 100%" placeholder="Please select"
                    @change="changeNetwork">
            <a-select-option :value="item.id" v-for="item in networkData" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <div class="col-span-2 m-auto">
        <img src="@/assets/images/deployDetail.png" class="w-full" />
      </div>
    </div>
    <div class="text-center mt-[16px]">
      <a-button class="btn" @click="deployClick" :loading="loading">{{
          loading ? 'Deploying' : 'Deploy'
        }}</a-button>
    </div>
    <!-- <div>
      <a-button @click="deployContract">test deploy</a-button>
    </div> -->
  </div>
  <SelectWallet :visible="visible" @cancelModal="cancelModal"></SelectWallet>
  <Wallets ref="showWallets"></Wallets>

  <a-modal v-model:visible="margumentVisible" title="Contract Metadata" :footer="null">
    <template #closeIcon>
      <img class="" src="@/assets/icons/closeIcon.svg" />
    </template>
    <a-form ref="modalFormRef" class="modalFormRef col-span-3 mb-[16px]" :model="testData" name="userForm"
            :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" autocomplete="off" noStyle>
      <a-form-item class="mb-[32px]" :name="item.name" :rules="[{ required: true }]" v-for="(item, _) in abiInputData">
        <div class="text-[#151210] mb-[12px]">{{ item.name }}</div>
        <a-input v-model:value="testData[item.name]" :placeholder="'Please input ' + item.name" allowClear />
      </a-form-item>
    </a-form>
    <div class="text-center">
      <a-button class="done-btn" @click="getModalData">Done</a-button>
    </div>
  </a-modal>

  <a-modal v-model:visible="aptosNetworkVisible" title="Operation Warning" :footer="null"
           class="modalFormRef col-span-3 mb-[16px]" autocomplete="off" noStyle>
    <template #closeIcon>
      <img class="" src="@/assets/icons/closeIcon.svg" />
    </template>
    <p style="margin-bottom: 0;">The selected network is inconsistent with the network selected in the wallet plugin. </p>
    <p>To complete the transaction deployment properly, please switch to the desired network in the wallet plugin.</p>
    <div class="text-center">
      <a-button class="done-btn" style="margin-top: 15px;" @click="handleAptosNetwork">Done</a-button>
    </div>
  </a-modal>


  <starkNetModal :starknetVisible="starknetVisible" :deployTxHash="deployTxHash" @cancelModal="cancelStarkNetModal">
  </starkNetModal>
</template>
<script lang='ts' setup>
import {onMounted, reactive, ref} from "vue";
import type {FormInstance} from 'ant-design-vue';
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";
import * as ethers from "ethers";
import YAML from "yaml";
import Breadcrumb from "../components/Breadcrumb.vue";
import SelectWallet from "./components/SelectWallet.vue";
import Wallets from "@/components/Wallets.vue";
import {useThemeStore} from "@/stores/useTheme";
import {useDeployAddressStore} from "@/stores/useDeployAddress";
import {useI18n} from 'vue-i18n';
import {apiGetProjectsContract, apiGetProjectsVersions} from "@/apis/workFlows";
import {apiGetProjectsDetail, apiProjectsContractDeploy} from "@/apis/projects";
import {connect} from "@argent/get-starknet";
import {ContractFrameTypeEnum} from "@/enums/frameTypeEnum";
import {PetraWallet} from "petra-plugin-wallet-adapter";
import {WalletCore} from '@aptos-labs/wallet-adapter-core'
import {AptosClient, BCS, HexString, TxnBuilderTypes} from 'aptos'
import {sleep} from "@/utils/tool"

import {fromB64, JsonRpcProvider, normalizeSuiObjectId, testnetConnection, TransactionBlock,} from '@mysten/sui.js';

import {WalletStandardAdapterProvider} from "@mysten/wallet-adapter-wallet-standard"

const formRef = ref<FormInstance>();
const modalFormRef = ref<FormInstance>();
const theme = useThemeStore();
const deployAddress = useDeployAddressStore();
const router = useRouter();
const { t } = useI18n()

const frameType = ref(1);
const argsMap = new Map();
const deployTxHash = ref('');
const starknetHashData = reactive({});
const testData = ref({});
const queryParams = reactive({
  id: router.currentRoute.value.params?.id,
  version: router.currentRoute.value.params?.version,
  contract: router.currentRoute.value.params?.contract,
})

const loading = ref(false);
const visible = ref(false);
const margumentVisible = ref(false);
const selectedIndex = ref(0);
const selectId = ref();
const showWallets = ref();
const versionData = reactive([]);
const chainData = reactive<any>([]);
const networkData = ref<any>([{ name: 'Ethereum/Mainnet', id: '1' }, { name: 'Ethereum/Goerli', id: '5' }, { name: 'Ethereum/Sepolia', id: 'aa36a7' }])
const projectsContractData = reactive<any>([]);
const projectName = ref('');
const abiInputData = ref([]);
const chainName = ref('');
const rpcUrl = ref('');
const currencySymbol = ref('');

// aptos
const arr = [new PetraWallet()]
const aptosWallet: any = new WalletCore(arr)
const petraAddress = ref('')
const petraMv = ref<any>([])
const petraBsc = ref<any>([])
const aptosContractId = ref<any>([])
const aptosNetwork = ref('')
const aptosNetworkVisible = ref(false)
const abiFn = ref<any>()

// sui
const suiWallet = new WalletStandardAdapterProvider()


const formState = reactive({
  version: router.currentRoute.value.params?.version,
  nameData: [],
  name: [],
  chain: undefined,
  network: undefined,
});

const starknetVisible = ref(false);
const hasDeclareHash = ref(false);
const hasDeployHash = ref(false);

const starkWareData = reactive({});

const connectWallet = async () => {
  const windowStarknet = await connect({
    include: ["argentX"],
  })
  await windowStarknet?.enable({ starknetVersion: "v4" })
  return windowStarknet
}

const deployContract = async (item: any) => {
  loading.value = true;
  try {
    const classHash = '0x399998c787e0a063c3ac1d2abac084dcbe09954e3b156d53a8c43a02aa27d35';
    // const walletData = await connectWallet();
    const response = await starkWareData.account.deploy({
      classHash: classHash,
      constructorCalldata: []
    })
    setProjectsContractDeploy('', response.contract_address[0], item.id)

    const receiptResponsePromise = await starkWareData.account.waitForTransaction(response.transaction_hash, undefined, ['ACCEPTED_ON_L2'])
    deployAddress.setDeployAddress(starkWareData)
    localStorage.setItem('deployAddressData', JSON.stringify(starkWareData))
    if (receiptResponsePromise.status === 'ACCEPTED_ON_L2') {
      // contract_address.value = response.contract_address[0]
      router.push(`/projects/${queryParams.id}/contracts-details/${queryParams.version}`)
    } else {
      loading.value = false
    }
  } catch (err: any) {
    loading.value = false
    console.log('err:', err)
  }
};

const deploySuiContract = async (item: any)=> {

  loading.value = true
  console.log('deploy sui')

  const wallets = suiWallet.get()
  if(wallets.length === 0){
    message.error(t('common.operateFail'));
    loading.value = false
    return
  }

  const wallet = wallets[0]
  try {
    await wallet.connect()
  }catch (e) {
    message.error("refuse connect wallet")
    loading.value = false
    return
  }
  console.log(wallet)

  let accountAddress = ""
  let network = ""
  try {
    const accounts = await wallet.getAccounts()
    if( accounts.length === 0 ){
      message.error("get wallet accounts fail")
      loading.value = false
      return
    }
    accountAddress = accounts[0].address
    network = accounts[0].chains[0]
    console.log("network: ",network)

    if (network !== formState.network){
      message.error("selected network does not match Sui wallet ")
      loading.value = false
      return
    }
  }catch (e) {
    message.error("get wallet accounts fail")
    loading.value = false
    return
  }

  const compiledModulesAndDeps = JSON.parse(item.byteCode)
  console.log(compiledModulesAndDeps)
  const tx = new TransactionBlock();
  const [upgradeCap] = tx.publish(
      compiledModulesAndDeps.modules.map((m: any) => Array.from(fromB64(m))),
      compiledModulesAndDeps.dependencies.map((addr: any) =>
          normalizeSuiObjectId(addr),
      ),
  );


  tx.transferObjects([upgradeCap], tx.pure(accountAddress));
  let digest = ""
  try{
    console.log('submit tx')
    const result = await wallet.signAndExecuteTransactionBlock({ transactionBlock: tx });
    console.log('submit tx result: ', result)
    digest = result.digest
  }catch (e) {
    loading.value = false
    return
  }
  console.log('submit tx success')

  message.loading("submit tx success, checking transaction ... ")


  let rpc = undefined

  // get deployed module address
  if (network === 'sui:devnet'){
    rpc  = new JsonRpcProvider()
  }else{
    rpc = new JsonRpcProvider(testnetConnection)
  }


  let txn = undefined
  for (let i = 0 ;i< 30; i++){
    await sleep(1000)
    try{
      txn = await rpc.getTransactionBlock({
        digest: digest,
        // only fetch the effects field
        options: {showEffects: true, showObjectChanges: true},
      })

      break
    }catch (e){

    }
  }

  if (txn === undefined){
    message.error("unable to check transaction")
    return
  }

  console.log("checkTransaction result: ",txn)
  if( txn != undefined && txn.objectChanges != undefined){
    const publishChange = txn.objectChanges.find(t => {
      return t.type === 'published'
    })
    if (publishChange === undefined){
      message.error("cannot get deployed module address")
      return
    }

    await setProjectsContractDeploy('',publishChange.packageId,item.id)

  }

  loading.value = false

  router.push(`/projects/${queryParams.id}/contracts-details/${queryParams.version}`)
}

// 查询版本号
const getVersion = async () => {
  const { data } = await apiGetProjectsVersions({ id: queryParams.id });
  Object.assign(versionData, data)
};

const getProjectsContract = async () => {
  const { data } = await apiGetProjectsContract({ id: queryParams.id, version: queryParams.version });
  data.map((item: any) => {
    item.label = item.name;
    item.value = item.id;
    item.modalFormData = reactive({});
    item.abiInfoData = YAML.parse(item.abiInfo);
    petraMv.value.push(item.aptosMv);
    petraBsc.value.push(item.byteCode)
    aptosContractId.value.push(item.id)
    // aptos abi不走之前的那一套
    if (frameType.value !== 2 && frameType.value !== 5) {
      setAbiInfo(item);
    }
  })
  Object.assign(projectsContractData, data)
}


//  创建合约
const contractFactory = async (abi: any, bytecode: any, argsMapData: any, contractId: number) => {
  loading.value = true
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  const factory = new ethers.ContractFactory(
      abi,
      bytecode,
      provider.getSigner()
  );
  try {
    let value = argsMapData || {}
    const contract = await factory.deploy(...Object.values(value));
    await contract.deployed();
    return setProjectsContractDeploy(ethereum.chinaId, contract.address, contractId)
  } catch (errorInfo) {
    // 失败的处理
    message.error(t('common.operateFail'));
  } finally {
    loading.value = false;
  }
}

const cancelStarkNetModal = () => {
  starknetVisible.value = false;
  hasDeclareHash.value = false;
}

const switchToChain = async (chainId: string) => {
  loading.value = true;
  window.ethereum && window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${chainId}` }],
  }).then((res: any) => {
    loading.value = false;
    message.success('success');
    // console.info(res, '成功')
  }).catch((err: any) => {
    if (err.code === 4902) {
      message.info('Please add the network first');
      addToChain(chainId)
    } else {
      message.error('faild')
    }
  })
}

const addToChain = (chainId: string) => {

  window.ethereum && window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: `0x${chainId}`,
        chainName: chainName.value,
        rpcUrls: [rpcUrl.value],
        // nativeCurrency: {
        //   name: 'Hm',
        //   symbol: 'M',
        //   decimals: 18,
        // },
      },
    ],
  }).then((res: any) => {
    message.info('successfully added')
    // console.log(res)
  }).catch((err: any) => {
    console.log(err.code, 'code')
    if (err.code === 4001) {
      message.info('Cancel adding a network')
    } else {
      message.info('faild')
    }
  }).finally(() => {
    loading.value = false;
    message.success('success')
  }).catch((err: any) => {
    message.success('faild')
  })
}

const setProjectsContractDeploy = async (chinaId: string, address: string, contractId: number) => {
  const network: any = networkData.value.find(item => { return item.id === formState.network })
  const queryJson = {
    id: queryParams.id,
    contractId: contractId,
    projectId: queryParams.id,
    version: formState.version,
    network: network.name,
    address: address,
  }
  const { data } = await apiProjectsContractDeploy(queryJson)
  return data
}

// aptos 的网络切换
const handleAptosNetwork = () => {
  aptosNetworkVisible.value = false
}

// aptos petra
const deploy = () => {
  console.log('bsc mv', petraBsc.value[0], petraMv.value[0])
  aptosWallet.connect("Petra").then(async () => {
    // debugger
    petraAddress.value = aptosWallet.account.address
    console.log('petra connected', aptosWallet.network, formState.network)
    aptosNetwork.value = aptosWallet.network.name;
    // aptos 的network处理
    if (aptosNetwork.value != formState.network) {
      aptosNetworkVisible.value = true
    } else {
      const codeSerializer = new BCS.Serializer()
      const modules = [
        new TxnBuilderTypes.Module(
            new HexString(
                // eslint-disable-next-line max-len
                petraMv.value[0],
            ).toUint8Array(),
        ),
      ]
      BCS.serializeVector(modules, codeSerializer)
      const payload: any = new TxnBuilderTypes.TransactionPayloadEntryFunction(
          TxnBuilderTypes.EntryFunction.natural(
              "0x1::code",
              "publish_package_txn",
              [],
              [BCS.bcsSerializeBytes(new HexString(petraBsc.value[0]).toUint8Array()), codeSerializer.getBytes()],
          ),
      );
      await aptosWallet.signAndSubmitTransaction(payload).then(async (tx: any) => {
        console.log('send:', tx)
        // NODE_URL 应该根据网络动态切换
        const NODE_URL = `https://fullnode.${aptosNetwork.value}.aptoslabs.com`;
        const petraClient = new AptosClient(NODE_URL);
        const getaAbiRes: any = await petraClient.getTransactionByHash(tx.hash)
        console.log('getaAbiRes', getaAbiRes)
        abiFn.value = getaAbiRes?.changes && getaAbiRes?.changes[0]?.data?.abi
      })
      const queryJson: any = {
        id: queryParams.id,
        contractId: aptosContractId.value[0],
        projectId: queryParams.id,
        version: formState.version,
        network: formState.network,
        address: petraAddress.value,
      }
      if (abiFn.value) {
        queryJson.abiInfo = JSON.stringify(abiFn.value) //aptos 独有的参数
      }
      const result = await apiProjectsContractDeploy(queryJson)
      if (result.code === 200 && frameType.value === 2) {
        router.push(`/projects/${queryParams.id}/contracts-details/${queryParams.version}`)
      }
    }

  }).catch((error: any) => {
    console.log('petra failed', error)
  })
}

const deployClick = async () => {
  // frameType 1.evm 2.aptos 3.ton 4.starkware,5: sui
  if (frameType.value === 4) {
    try {
      const values = await formRef?.value.validateFields();
      projectsContractData.map((item: any) => {
        deployContract(item)
      })
    } catch (err: any) {
      // 表单校验
      console.log('Failed:', err);
    }
  } else if (frameType.value === 2) { //aptos
    try {
      await formRef?.value.validateFields();
      deploy()
    } catch (error: any) {
      console.log('aptos error', error)
    }
  }else if (frameType.value === 5){ // sui
    try {
      await formRef?.value.validateFields();
      projectsContractData.map((item: any) => {
        deploySuiContract(item)
      })

    } catch (error: any) {
      console.log('aptos error', error)
    }
  } else {
    // 有值说明已连接钱包
    // const isWalletAccount = window.localStorage.getItem("alreadyConnectedWallets");
    // if (isWalletAccount == null || isWalletAccount === '[]') {
    const walletAccount = window.localStorage.getItem("walletAccount");
    if(walletAccount === undefined || walletAccount === null){
      showWallets.value?.onClickConnect();
      // setWalletBtn(true)
    } else {
      // 连接钱包后再创建合约
      try {
        const values = await formRef?.value.validateFields();
        // const modalValues = await modalFormRef?.value.validateFields();
        const { nameData } = formState;
        const { ethereum } = window;
        const network = `0x${formState.network}`
        if (ethereum.chainId !== network) {
          switchToChain(formState.network)
        } else {
          setContractFactory(nameData)
        }

      } catch (errorInfo) {
        // 表单校验
        console.log('Failed:', errorInfo);
      }
    }
  }
}


const setContractFactory = async (nameData: any) => {
  let promise: any = [];
  nameData.map((item: number) => {
    formState.name.push(item.id);
    let selectItem: any = projectsContractData.find(val => { return val.id === item.id });
    // console.log(selectItem, 'selectItem')
    promise.push(contractFactory(selectItem.abiInfoData, selectItem.byteCode, argsMap.get(selectId.value), item.id));
  })
  const res = await Promise.all(promise)
  loading.value = false;
  const result = res.some(it => {
    return it !== undefined
  })
  result ? router.push(`/projects/${queryParams.id}/contracts-details/${queryParams.version}`) : loading.value = false
}

const setAbiInfo = (selectItem: any) => {
  // console.log(selectItem, 'kk')
  const constructorData = selectItem.abiInfoData.find((item: any) => { return item.type === 'constructor' })
  if (constructorData && constructorData.inputs.length > 0) {
    selectItem.hasArgument = true;
  }
  if (selectItem.hasArgument) {
    selectItem.hasModalFormData = true;
  }
}

const getModalData = async () => {
  try {
    const modalValues = await modalFormRef?.value.validateFields();
    formState.nameData.push(projectsContractData[selectedIndex.value]);
    projectsContractData[selectedIndex.value].hasModalFormData = false;
    margumentVisible.value = false;
    let data = Object.assign({}, testData.value)
    argsMap.set(selectId.value, data)
  } catch (err: any) {
    projectsContractData[selectedIndex.value].hasModalFormData = true;
    console.info(err)
  }
};


const selectAargumentName = (val: any, index: number) => {
  selectedIndex.value = index;
  selectId.value = val.id;
  testData.value = argsMap.get(val.id);
  margumentVisible.value = true;
  val.abiInfoData.map((item: any) => {
    if (item.type === 'constructor' && item.inputs.length > 0) {
      abiInputData.value = item.inputs;
      if (!testData.value) {
        let param = {};
        item.inputs.forEach((it: any) => {
          param[it.name] = "";
        })
        testData.value = param
      }
    }
  })
}

const cancelModal = (val: boolean) => {
  visible.value = val
}

const changeNetwork = (val: any) => {
  const data = networkData.value.find((item: any) => { return item.id === val });
  chainName.value = data.networkName;
  rpcUrl.value = data.url;
  currencySymbol.value = currencySymbol;
  console.log('chainName:',chainName.value)
  console.log('rpcUrl:', rpcUrl.value)
};

const changeChain = (val: string) => {
  formState.network = undefined;
  if (val === 'Ethereum') {
    // ETH
    networkData.value = [{ name: 'Ethereum/Mainnet', id: '1' }, { name: 'Ethereum/Goerli', id: '5' }, { name: 'Ethereum/Sepolia', id: 'aa36a7' }, {name: 'Ethereum/Hamster',networkName: 'Hamster Moonbeam', id: '501', url: 'https://rpc-moonbeam.hamster.newtouch.com'}]
  } else if (val === 'Polygon') {
    // 货币符号 currencySymbol = MATIC
    networkData.value = [{ name: 'Polygon/Mainnet', id: '89', url: 'https://polygon-rpc.com/', networkName: 'Polygon Mainnet' }, { name: 'Polygon/Mumbai', id: '13881', url: 'https://rpc-mumbai.maticvigil.com', networkName: 'Polygon Mumbai' }]
  } else if (val === 'BNB Smart Chain') {
    // 货币符号  BNB
    networkData.value = [{
      name: 'Bsc/Mainnet',
      id: '38',
      url: 'https://bsc.nodereal.io/',
      networkName: 'Mainnet'
    }, {
      name: 'Bsc/Testnet',
      id: '61',
      url: 'https://bsc-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5	',
      networkName: 'Testnet'
    }]
  } else if (val === 'Sui'){
    networkData.value = [{
      name: 'Devnet',
      id: 'sui:devnet',
      url: 'https://explorer-rpc.devnet.sui.io/',
      networkName: 'Devnet'
    },{
      name: 'Testnet',
      id: 'sui:testnet',
      url: 'https://explorer-rpc.testnet.sui.io/',
      networkName: 'Testnet'
    }]
  }
}

const changeVersion = (val: string) => {
  queryParams.version = val
  getProjectsContract()
}

const getProjectsDetail = async () => {
  try {
    const { data } = await apiGetProjectsDetail(queryParams.id);
    frameType.value = data.frameType;
    switch (frameType.value) {
      case 1:
        Object.assign(chainData, ['Ethereum', 'Polygon', 'BNB Smart Chain'])
        // { name: 'Hamster Dev', id: '501' }
        networkData.value = [{ name: 'Ethereum/Mainnet', id: '1' }, { name: 'Ethereum/Goerli', id: '5' }, { name: 'Ethereum/Sepolia', id: 'aa36a7' }]
        break;
      case 2:
        // id 是胡扯的方便存储和使用，没有找到具体的和钱包网络名称的映射关系
        Object.assign(chainData, ['Aptos'])
        networkData.value = [{ name: 'Mainnet', id: 'Mainnet' }, { name: 'Testnet', id: 'Testnet' }, { name: 'Devnet', id: 'Devnet' }]
        break;
      case 3:
        break;
      case 4:
        Object.assign(chainData, ['StarkWare'])
        networkData.value = [{ name: 'Mainnet', id: '1', networkName: 'mainnet-alpha' }, { name: 'Testnet', id: '2', networkName: 'goerli-alpha' }, { name: 'Testnet2', id: '3', networkName: 'goerli-alpha-2' }]
        const data = await connectWallet();
        Object.assign(starkWareData, data)
        break;
      case 5:
        Object.assign(chainData, ['Sui'])
        networkData.value= [{name: 'Devnet', id: 'devnet', networkName: 'Devnet'},{name: 'Testnet',id:'testnet',networkName: 'Testnet'}]
        break;
      default: break;
    }
  } catch (err: any) {

  }
}

onMounted(async () => {
  projectName.value = localStorage.getItem("projectName") || '';
  getVersion()
  await getProjectsDetail();
  await getProjectsContract()
})

</script>
<style lang='less' scoped>
@backGroundCOlor: #1D1C1A;
@baseColor: #E2B578;

.dark-css {
  :deep(label) {
    color: #ffffff !important;
  }
}

.artifactsDeploy {
  font-size: 14px;
}

.name-item {
  margin-bottom: 0px !important;
}

.modalFormRef {
  .ant-form-item {
    &:last-child {
      margin-bottom: 20px;
    }
  }
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

.btn {
  width: 440px;
  height: 43px;
}

.done-btn {
  width: 120px;
  height: 43px;
}

:deep(.ant-checkbox-wrapper-checked:hover) {
  border-radius: 4px;
}

:deep(.ant-checkbox-checked+span) {
  color: #E2B578;
}

:deep(.ant-checkbox-wrapper span:hover) {
  color: #E2B578;
}

:deep(.ant-checkbox-wrapper) {
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.ant-checkbox-inner),
:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: transparent;
}

:deep(.ant-checkbox-checked:after) {
  border-radius: 4px;
  background-color: transparent;
}

:deep(.ant-checkbox-inner) {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner:after) {
  border: 5px solid #E2B578;
  transform: rotate(0deg) scale(1);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 2px;
}

:deep(.ant-checkbox-wrapper:hover) {
  border-radius: 4px;
}

input::-webkit-input-placeholder,
input:-moz-placeholder,
input::-moz-placeholder,
input:-ms-input-placeholder {
  color: #E0DBD2;
}

:deep(.ant-form-item-has-error .ant-select:not(.ant-select-disabled):not(.ant-select-customize-input) .ant-select-selector) {
  background-color: transparent;
}

html[data-theme="dark"] {
  .ant-input-affix-wrapper {
    border: 1px solid #434343;
    color: #ffffff;
  }
}

.dark-css {
  :deep(.ant-input) {
    color: #ffffff;
  }
}

.ant-input-affix-wrapper {
  background: transparent;
  border-radius: 8px;
  border: 1px solid #EBEBEB;
}

:deep(.ant-input) {
  background: transparent;
  color: #121211;
}

:deep(.ant-modal) {
  input {
    color: #000;
  }
}
</style>
