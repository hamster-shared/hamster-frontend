<template>
  <div class="contractSetails flex justify-between mb-[24px] items-center">
    <Breadcrumb :routes="breadCrumbInfo">
      <template v-slot:tags>
        <span
          class="ml-4 text-[14px] rounded-[32px] py-1 px-4 border border-solid dark:border-[#434343] border-[#EBEBEB]">
            <label v-if="projectType === 1">{{ ContractFrameTypeEnum[frameType] }}</label>
            <label v-else-if="projectType === 2">{{ FrontEndDeployTypeEnum[deployType] }}</label>
        </span>
      </template>
    </Breadcrumb>
    <a-select class="select-dark" ref="select" v-model:value="contractDeployDetail.version" style="width: 180px"
      @change="changeVersion">
      <a-select-option :value="item" v-for="item in versionData" :key="item">{{
        item
      }}</a-select-option>
    </a-select>
  </div>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] p-[32px] rounded-[8px]">
    <a-tabs v-model:activeKey="activeKeyId" class="dark:text-white text-[#121211]" @change="changeActiveKey">
      <a-tab-pane v-for="(item, key) in contractInfo" :key="item.id" :tab="key">
        <Overview v-if="frameType === 7" :deployInfo="item.deployInfo[0]"></Overview>
        <a-table v-else :dataSource="item.deployInfo" :columns="columns" class="mb-[32px]" :pagination="false"
          :customRow="customRowClick" :rowClassName="setRowClassName">
          <template #bodyCell="{ record, column }">
            <template v-if="column.key === 'action'">
              <a v-if="frameType === 5" @click.stop="copyInfo(record.address, 'value')">Copy Address</a>
              <a v-else @click.stop="deploy(record)">Deploy</a>
            </template>
          </template>
        </a-table>
        <div class="" v-if="item.abiInfo">
          <div class="text-[24px] font-bold mb-[32px]">Contract List</div>
          <ContractList v-if="frameType" :abiInfo="item.abiInfo" :contractAddress="contractAddress" :frameType="frameType"
            @checkContract="checkContract" :canisterId="item.deployInfo[0].address" :network="item.deployInfo[0]?.network">
          </ContractList>
        </div>
        <div v-if="frameType ===  5">
          <div class="text-[24px] dark:text-[#FFFFFF] font-bold mb-[32px]">Contract Explorer</div>
          <div class="flex bg-css dark:!border-[#434343]">
            <div class="w-1/3 left-css dark:!border-[#434343] p-[30px]">
              <div class="flex items-center font-bold mb-4">
                <img src="@/assets/icons/send-w.svg" class="h-[20px] dark:hidden mr-[5px]" />
                <img src="@/assets/icons/send-dark.svg" class="h-[20px] hidden dark:inline-block mr-[5px]" />Modules
              </div>
              <div class="pb-4 ">
                <div @click="setFunctionList(item)"
                  :class="{ 'active-css': item === moduleName }"
                  class=" cursor-pointer  text-[#73706E] dark:text-[#E0DBD2] dark:!shadow-none py-[16px] pl-[30px]"
                  v-for="(item, index) in moduleList" :key="index">{{ item }}</div>
              </div>
            </div>
            <div class="w-2/3 p-[30px]">
              <div class="font-bold mb-6">Functions</div>
              <NoData v-if="functionList.length === 0"></NoData>
              <a-collapse class=" dark:!border-[#434343] dark:!shadow-none" v-model:activeKey="collapsectiveKey" v-for="(items, keys) in functionList" :key="keys">
                <a-collapse-panel :key="String(keys + 1)" :header="items.title" :showArrow="false">
                  <template #extra>
                    <div>
                      <img class="up-tran w-[12px] hidden dark:inline-block" src="@/assets/icons/up-b.svg" />
                      <img class="up-tran w-[12px] dark:hidden" src="@/assets/icons/up.svg" />
                    </div>
                  </template>
                  <div v-for="(val, key) in items.paramList" :key="key" class="text-[#73706E] dark:text-[#E0DBD2]">
                    <div>{{ val.name }}</div>
                    <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="my-4">
                      <a-input v-model:value="val.value" :placeholder="val.placeholder" autocomplete="off" />
                    </div>
                    <!-- <div class="dark:bg-[#2B2B2B] bg-[#F6F6F6] text-[#C3C4C7] rounded-[8px] p-[16px] my-4 break-all">{{ val.value }}</div> -->
                  </div>
                  <div class="text-right mb-4">
                    <a-button type="primary" class="w-[100px]" @click="sendFunction(moduleName, items.title)">Send</a-button>
                  </div>
                  <div class="output-css dark:!shadow-none p-[20px] hidden" :id="`div${moduleName}${items.title}`">
                    <div class="flex justify-between mb-[12px]">
                      <span class="font-normal">Output</span>
                      <span class="open-link-css cursor-pointer" @click="copyInfo(`send${moduleName}${items.title}`, 'id')">
                        <img src="@/assets/icons/copy.svg" />Copy
                      </span>
                    </div>
                    <div class="bg-white rounded-[5px] text-[#E2B578] p-[20px]" :id="`send${moduleName}${items.title}`">werqwerqwerwqerwqrqwr</div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>

</template>
<script lang='ts' setup>
import { ref, reactive, onBeforeMount } from "vue";
import { message } from 'ant-design-vue'
import { useRouter,useRoute } from "vue-router";
import { useThemeStore } from "@/stores/useTheme";
import Breadcrumb from "@/components/BreadCrumb.vue";
import ContractList from "./components/ContractList.vue";
import Overview from "./components/Overview.vue";
import NoData from "@/components/NoData.vue"
import { ContractFrameTypeEnum, FrontEndDeployTypeEnum } from "@/enums/frameTypeEnum";
import { apiGetContractDeployDetail, apiGetProjectsVersions } from "@/apis/workFlows";
import { apiGetProjectsDetail } from "@/apis/projects"
import {TransactionBlock, JsonRpcProvider, Connection, testnetConnection} from '@mysten/sui.js';
import { WalletStandardAdapterProvider } from "@mysten/wallet-adapter-wallet-standard"
import {useI18n} from "vue-i18n";
import {sleep} from "@/utils/tool";

const router = useRouter();
const route = useRoute()
const theme = useThemeStore();
const { t } = useI18n()

const queryJson = reactive({
  id: router.currentRoute.value.params?.id,
  version: router.currentRoute.value.params?.version,
})
const collapsectiveKey = ref([])
const activeKey = ref('');
const activeKeyId = ref('');
const projectName = ref('');
const frameType = ref(0);
const projectType = ref(0);
const deployType = ref(0);
const versionData = reactive([]);
const moduleList = ref<any>([]);
const functionList = ref<any>([]);
const moduleName = ref('cesh');
const contractName = ref('');
const contractAddress = ref('');
const selectedRow = ref(0);
const breadCrumbInfo = ref<any>([])
const columns = [
  {
    title: 'Network',
    dataIndex: 'network',
    align: "center",
    key: 'network',
  },
  {
    title: () => (frameType.value === 5 ? 'Package' : 'Address'),
    dataIndex: 'address',
    align: "center",
    customRender: ({ text }) => {
      if (!text) {
        return '-'
      }
    },
    key: 'address',
  },
  {
    title: 'Action',
    align: "center",
    key: 'action',
  }];

// const tabList = reactive([]);
const contractDeployDetail = reactive({})
const contractInfo = reactive({})
// connect to Devnet
const providers = new WalletStandardAdapterProvider()
// get tokens from the DevNet faucet server
const provider = providers.get()[0]

const workflowsDetailsData = ref<any>({})

const setFunctionList = (moduleVal: string) => {
  getFunctionList(moduleVal);
  moduleName.value = moduleVal;
}

const getSuiRpcConnection = (network: string ) => {
  if( network === "Testnet") {
    return new JsonRpcProvider(testnetConnection)
  }else {
    return new JsonRpcProvider()
  }
}

// 获取package 的所有module
const getModuleList = async () => {
  const row = contractInfo[activeKey.value].deployInfo[selectedRow.value]
  const provider = getSuiRpcConnection(row.network)
  const txn = await provider.getObject({
    id: row.address,
    // fetch the object content field
    options: { showContent: true },
  });

  moduleList.value = Object.keys(txn.data.content.disassembled);
  moduleName.value = moduleList.value[0];
  getFunctionList(moduleName.value);
}
// 获取某个package 下的module 的方法区内容
const getFunctionList = async (moduleName: string)=> {
  const row = contractInfo[activeKey.value].deployInfo[selectedRow.value]
  const provider = getSuiRpcConnection(row.network)
  const packageObjectId = row.address
  const txn = await provider.getNormalizedMoveModule({
    package: packageObjectId,
    module: moduleName,
  })
  let methods = Object.keys(txn.exposedFunctions)
  functionList.value.length = 0;
  collapsectiveKey.value.length = 0;
  for (let method of methods) {
    if (txn.exposedFunctions[method].isEntry === true) {

      let typeParameters = txn.exposedFunctions[method].typeParameters;
      let parameters: any[] = txn.exposedFunctions[method].parameters;

      let list: any[] = [];
      let typeParamList: any = [];
      typeParameters.forEach((element, index) => {
        let typeParam = "T" + index ;
        element.abilities.forEach((ele, ind) => {
          if (ind === 0) typeParam += ": ";
          if (ind > 0) typeParam += "+";
          typeParam += ele;
        })
        list.push({
          "name": 'Type' + index,
          "placeholder": typeParam,
          "value": ''
        })
        typeParamList[index] = typeParam;
      });
      parameters.forEach((element, index) => {
        let param = "";
        if (element.Struct) {
          let ele = element.Struct;
          param = setParamList(ele, typeParamList);
        }
        else if (element.MutableReference) {
          let ele = element.MutableReference.Struct;
          param = setParamList(ele, typeParamList);
        } else if(element.Vector) {
          param = `Vector<${element.Vector}>`;
        } else if(element.TypeParameter !== undefined) {
          param = typeParamList[element.TypeParameter];
        } else {
          param = element;
        }
        if (param !== '') {
          list.push({
            "name": 'Arg' + index,
            "placeholder": param,
            "value": ''
          })
        }
      });
      functionList.value.push({
        "paramList": list,
        "title": method
      })
    }
  }
}

const setParamList = (element: any, typeParamList: any) => {
  let param = "";
  if (element.module != 'tx_context') {
    param = element.address + "::" + element.module + "::" + element.name;
    if (element.typeArguments.length > 0) {
      param += "<";
      element.typeArguments.forEach((ele: any) => {
        if (ele.Struct) {
          param += ele.Struct.address + "::" + ele.Struct.module + "::" + ele.Struct.name;
        } else {
          param += typeParamList[ele.TypeParameter]
        }
      });
      param += ">";
    }
  }
  return param;
}

// 获取当前moduleName ,当前function 区下所有的输入参数
const getSuiFunctionInputArgs = (functionName: string) => {

  let list: any = [];
  functionList.value.forEach((element: any) => {
    if (element.title === functionName) {
      element.paramList.forEach((ele: any) => {
        list.push(ele.value);
      });
    }
  });

  // 所有方法的输入内容，按顺序以数组返回
  return list;
}

const sendFunction = async (moduleName: string, functionName: string) => {

  const row = contractInfo[activeKey.value].deployInfo[selectedRow.value]

  const wallets = providers.get()
  if(wallets.length === 0){
    message.error(t('common.operateFail'));
    return
  }

  const wallet = wallets[0]
  let accountAddress = ""
  let network = ""
  try {
    const accounts = await wallet.getAccounts()
    if( accounts.length === 0 ){
      message.error("get wallet accounts fail")
      return
    }
    accountAddress = accounts[0].address
    network = accounts[0].chains[0]
    console.log("network: ",network)

    if (network.replace("sui:","") !== row.network.toLowerCase() ){
      message.error("selected network does not match Sui wallet ")
      return
    }
  }catch (e) {
    message.error("get wallet accounts fail")
    return
  }


  const tx = new TransactionBlock();
  const packageObjectId = row.address

  // 获取当前moduleName ,当前function 区下所有的输入参数
  const args = getSuiFunctionInputArgs(functionName);
  console.log("args:", args)

  let txArgs = []

  for( let arg of args){
    txArgs.push(tx.pure(arg))
  }

  tx.moveCall({
    target: `${packageObjectId}::${moduleName}::${functionName}`, // 第一个参数是packageId, 第二个是module Name， 第三个参数是方法名
    arguments: txArgs,
  });
  console.log("target:",`${packageObjectId}::${moduleName}::${functionName}`)
  const result = await provider.signAndExecuteTransactionBlock({
    transactionBlock: tx,
  })
  console.log(result)

  // 获取交易详情
  const rpcProvider = getSuiRpcConnection(row.network)

  let txn = undefined

  for (let i = 0 ;i< 30 ; i++) {
    try {
      await sleep(1000)
      txn = await rpcProvider.getTransactionBlock({
        digest: result.digest,
        // only fetch the effects field
        options: {},
      });
      break
    } catch (e) {

    }
  }

  console.log(txn)

  let showEle = document.getElementById("div"+moduleName+functionName) as HTMLElement || null;
  showEle.classList.remove("hidden");
  let divEle = document.getElementById("send"+moduleName+functionName) as HTMLElement || null;
  divEle.innerHTML = JSON.stringify(txn);
}

const getProjectsDetail = async () => {
  const { data } = await apiGetProjectsDetail(queryJson.id)
  Object.assign(workflowsDetailsData,data)
  frameType.value = data.frameType
  projectType.value = data.type;
  deployType.value = data.deployType;

  if (frameType.value === 5) {
    getModuleList();
  }
}

const getContractDeployDetail = async () => {
  const { data } = await apiGetContractDeployDetail(queryJson)
  Object.assign(contractDeployDetail, data)
  Object.assign(contractInfo, data.contractInfo)

  activeKey.value = Object.keys(contractInfo)[0];
  activeKeyId.value = Object.values(contractInfo)[0]?.id;
  contractAddress.value = Object.values(contractInfo)[0]?.deployInfo[0]?.address;
}

const getVersion = async () => {
  const { data } = await apiGetProjectsVersions({ id: queryJson.id });
  Object.assign(versionData, data)
}

const deploy = (val: any) => {
  router.push(`/projects/${queryJson.id}/artifacts-contract/${queryJson.version}/deploy/${activeKeyId.value}?from=Dashboard&name=${route.query?.name}`)
}
const changeVersion = (val: any) => {
  queryJson.version = val
  getContractDeployDetail()
}

const changeActiveKey = (activeKey: any) => {
  for (let contractInfoKey in contractInfo) {
    if (activeKey == contractInfo[contractInfoKey]?.id) {
      contractAddress.value = contractInfo[contractInfoKey]?.deployInfo[0]?.address
      selectedRow.value = 0;
    }
  }
  console.log(activeKey, 'activeKey')
}

const checkContract = (name: string) => {
  contractName.value = name
}


const customRowClick = (record: any, index: number) => {
  return {
    style: {
      cursor: 'pointer',
    },
    onClick: async (event: Event) => {
      contractAddress.value = record.address;
      selectedRow.value = index;
    }
  }
};

const setRowClassName = (record: any, index: number) => {
  if (index === selectedRow.value && theme.themeValue === 'dark') {
    return 'clickRowStyle-dark'
  }
  if (index === selectedRow.value && theme.themeValue === 'white') {
    return 'clickRowStyle'
  }
}

const copyInfo = (info: string, type: string) => {
  let inp = document.createElement("input");
  document.body.appendChild(inp);
  if (type === 'value') {
    inp.value = info;
  } else {
    inp.value = document.getElementById(info)?.innerHTML || '';
  }
  inp.select();
  document.execCommand("copy", false);
  inp.remove();
  message.success('copy success')
}

onBeforeMount(async() => {
  projectName.value = localStorage.getItem("projectName") || '';
  getVersion()
  await getContractDeployDetail()
  await getProjectsDetail()
  judgeOrigin()
})
// 判断跳转来源
const judgeOrigin = ()=>{
  breadCrumbInfo.value = [
    {
      breadcrumbName:'Projects',
      path:'/projects'
    },
    {
      breadcrumbName:workflowsDetailsData.name,
      path:`/projects/${workflowsDetailsData.id}/details/${workflowsDetailsData.type}`
    },
    {
      breadcrumbName:'Dashboard',
      path:''
    },
  ]
}

</script>
<style lang='less' scoped>
@baseColor: #E2B578;

:deep(.ant-select-selection-item) {
  color: @baseColor;
}

:deep(.clickRowStyle-dark) {
  background-color: #463F36;
}


:deep(.clickRowStyle) {
  background-color: #FFFAF3;
}

.up-tran {
  transform: rotate(90deg);
  transition: all .3s, visibility 0s;
}

:deep(.ant-collapse-item-active .up-tran) {
  transform: rotate(180deg);
}
:deep(.ant-collapse-item-active){
  border: 1px solid #E2B578;
  border-radius: 8px !important;
}
:deep(.ant-collapse-item:last-child>.ant-collapse-content){
  border-radius: 0 0 8px 8px !important;
}
:deep(.ant-collapse){
  box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
  border-radius: 8px;
  border: 1px solid #EBEBEB;
  margin-bottom: 30px;
}
:deep(.ant-collapse>.ant-collapse-item>.ant-collapse-header){
  font-weight: bold;
}
.active-css{
  background: rgba(226,181,120,0.2);
  box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
  border-radius: 12px;
  width: 200px;
}
.bg-css{
  box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1);
  border-radius: 12px;
  border: 1px solid #EBEBEB;
}
.left-css{
  border-right: 1px solid #EBEBEB;;
}
.output-css{
  background: rgba(226,181,120,0.1);
  box-shadow: 6px 6px 15px 0px rgba(242,238,234,0.1), 6px 6px 15px 0px rgba(242,238,234,0.1);
  border-radius: 5px;
}

// :deep(.ant-input, .ant-input-affix-wrapper){
//   padding: 26px 16px;
// }
// :deep(.dark-css .ant-input, .ant-input-affix-wrapper){
//   background-color: #2B2B2B !important;
//   border-color: #2B2B2B !important;
//   color: white !important;
// }
// :deep(.white-css .ant-input, .ant-input-affix-wrapper){
//   background-color: #F6F6F6 !important;
//   border-color: #F6F6F6 !important;
// }
</style>
