<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <bread-crumb :routes="breadCrumbInfo" />
    <DeployVersionInfomation v-if="versionList.length" ref="baseInfo" :versionList="versionList" :name="contractInfo.name" />
    <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
      <div class="text-[28px] font-bold mb-[10px]">Deployment Orchestration</div>
      <div class="text-[16px] text-[#73706E] dark:text-[#E0DBD2]">Automate multi-contract deployment through
        presetvdeployment sequence and
        logic</div>
      <!-- line -->
      <div class="h-[1px] my-[32px] border border-solid dark:border-[#434343] border-[#EBEBEB]"></div>
      <div class="grid grid-cols-2 gap-8">
        <!-- left -->
        <div>
          <DeploymentOrder ref="deploymentRef" v-if="contractOrchestration.length || noUseContract.length" @selectContractId="selectContractId" :contractOrchestration="contractOrchestration"
          :version="baseInfo.selectedVersion" :noUseContract="noUseContract">
          </DeploymentOrder>
        </div>
        <!-- right -->
        <div>
          <ContractParams ref="paramsRef" :contractOrchestration="contractOrchestration" :selectedName="selectedName" :inputData="paramInputData" :formData="paramFormData"></ContractParams>
          <InvokeContract ref="contractRef" :contractOrchestration="contractOrchestration" :selectedName="selectedName" :methodMap="methodMap" @setAbiInfo="setAbiInfo" @setDisabledSave="setDisabledSave"></InvokeContract>
          <div>
            <div class="flex justify-between mt-[30px]">
              <div class="text-[24px] font-bold">Proxy Contract</div>
              <a-switch v-model:checked="checked" @change="changeChecked" />
            </div>

            <div class="mb-[20px] text-[16px] text-[#73706E] dark:text-[#E0DBD2]">Automatically call contract methods
              post-deployment,
              including its
              own init method or other contracts' methods</div>
          </div>
          <div class="text-right">
            <a-button :disabled="disabledSave" @click="saveSingleContractInfo" class="w-[140px]">Save</a-button>
          </div>
        </div>
      </div>
      <!-- line -->
      <div v-if="!showFooter">
        <div class="h-[1px] my-[32px] border border-solid dark:border-[#434343] border-[#EBEBEB]"></div>
        <div>
          <div class="text-[24px] font-bold">Network / Chain</div>
          <div class="mt-[10px] mb-[20px]">Select a network to deploy this contract on. We recommend starting with a
            testent
          </div>
          <div class="flex justify-between">
            <a-select ref="select" v-model:value="selectNetwork" style="width: 50%" @change="changeNetwork"
              :options="networkListData.map((item:any, key: any) => ({label:item.chainName, value: key }))">
            </a-select>
            <div class="flex">
              <div v-if="networkLogo" class="mr-[24px] bg-[#E2B578] rounded-[8px] leading-[43px] px-[15px]">
                <img v-if="networkLogo" :src="networkLogo" class="h-[20px] mr-2" />
                <label class="text-[#E2B578] dark:text-[#FFFFFF]">{{ getPonitStr(walletAccount,6,4) }}</label>
              </div>
              <a-button v-if="!networkLogo" class="mr-[24px]" @click="connectWallet">Connect Wallet</a-button>
              <a-button :disabled="!networkLogo" @click="deployManyContract">Deploy Now</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <UsingWalltModal :visibleNumber="visibleNumber" :number="numberValue" @closeDeployContractsNumberModal="closeDeployContractsNumberModal" @goDeploy="goDeploy"/>
  <Wallets ref="showWallets" @setWalletBtn="setWalletBtn"></Wallets>
  <saveModal :visibleSave="visibleSave" @handleCancel="handleCancelModal" @handleSave="handleSaveModal"></saveModal>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import YAML from "yaml";
import { useRoute, useRouter } from 'vue-router';
import{ getPonitStr } from "@/utils/tool";
import { useThemeStore } from "@/stores/useTheme";
import { useWalletAddress } from "@/stores/useWalletAddress";
import BreadCrumb from "@/components/BreadCrumb.vue";
import DeployVersionInfomation from '@/components/DeployVersionInfomation.vue';
import ContractParams from './components/ContractParams.vue';
import InvokeContract from './components/InvokeContract.vue';
import saveModal from './components/saveModal.vue';
import UsingWalltModal from "./components/UsingWalltModal.vue";
import Wallets from "@/components/Wallets.vue";
import DeploymentOrder from "./components/DeploymentOrder.vue";
import { apiGetProjectsDetail } from '@/apis/projects'
import { apiGetProjectsContract, apiGetProjectsVersions } from "@/apis/workFlows";
import { apiSaveSingleContractInfo, apiGetSingleContractInfo, apiWaitContractList, apiArrangeDeployList, apiSaveOrchestrationInfo } from "@/apis/contractOrchestrationDeploy";
import { PROXY_CONSTRUCTOR, type DeployRecord , CONSTRUCTOR, FUNCTION } from "./components/DeployData";
import { message } from 'ant-design-vue';
import { DisplayFieldsBackwardCompatibleResponse } from '@mysten/sui.js';
import { apiEvmNetwork } from '@/apis/network'
import { switchToChain } from '@/utils/changeNetwork'

const theme = useThemeStore();
const walletAddress = useWalletAddress()

const selectNetwork = ref<string>('');
const checked = ref<boolean>(false);
const breadCrumbInfo = ref<any>([]);
const versionList = ref([]);
const selectedId = ref(''); //选中的合同id
const selectedName = ref(''); //选中的合同name
const route = useRoute()
const router = useRouter()
const showWallets = ref();
// 合约信息对象
const contractInfo = ref<any>({})
// 待编排部署的合约
const contractOrchestration = ref<any>([])
// 不编排合约列表
const noUseContract = ref<any>([])
const baseInfo = ref()
// 控制底部钱包部署按钮的显示
const showFooter = route.query.fromDetailSetting || ''
// 用于显示部署条数的提醒弹框
const visibleNumber = ref(false)
const numberValue = ref(0)

const networkListData = ref<any>([])
const networkLogo = ref('');

const walletAccount = ref("");
const isConnectedWallet = ref(false);
const isChange = ref(false);
const tempSelectId = ref('');
const tempAbiInfo = ref('');
const deploymentRef = ref();
const visibleSave = ref(false);
const methodMap = new Map();
const disabledSave = ref(true);
const paramsRef = ref();
const contractRef = ref();
const paramFormValue = ref<any>([]); //记录Contract Parameters表单值
const paramFormData = ref<any>({});
const paramInputData = ref<any>([]); //记录合同Contract Parameters字段
const methodFormValue = ref<any>([]); //记录Invoke Contract Method表单值
const methodFormList = ref<any>({});
const methodInputData = ref<any>([]); //记录合同Invoke Contract Method字段
const methodFunctionData = ref<any>([]);
const originalArrange = ref<DeployRecord>(); //参数值数据格式整理
const contractSingileInfo = ref<any>({});
const deployArrange = ref<DeployRecord>(); // deploy now整理数据

const changeChecked = (val: any) => {
  isChange.value = true;
}
const changeNetwork = (val: any) => {
  let item = networkListData.value[val];
  const walletAccount = window.localStorage.getItem("walletAccount");
  if (walletAccount === undefined || walletAccount === null) {
    connectWallet();
  } else {
    switchToChain(item.chainId, item.chainName, item.rpcUrl, item.symbol, item.decimals);
  }
  networkLogo.value = item.logo;
}

// 导航栏
const initBreadCrumb = () => {
  breadCrumbInfo.value = [
    {
      breadcrumbName: 'Projects',
      path: '/projects'
    },
    {
      breadcrumbName: contractInfo.value.name,
      path: `/projects/${contractInfo.value.id}/details/${contractInfo.value.type}`
    },
    {
      breadcrumbName: 'Deploy',
      path: ''
    },
  ]
}
const handleSaveModal = () => {
  // setSaveParamsValue();
  saveSingleContractInfo();
}
const handleCancelModal = () => {
  setSaveParamsValue();
  selectContractId(tempSelectId.value, tempAbiInfo.value);
}
//设置save参数值
const setSaveParamsValue = () => {
  visibleSave.value = false;
  paramsRef.value.isChange = false;
  contractRef.value.isChange = false;
  isChange.value = false;
}
//选择合约
const selectContractId = async (id: string, abiInfo: any) => {
  tempSelectId.value = id;
  tempAbiInfo.value = abiInfo;
  if (paramsRef.value.isChange || contractRef.value.isChange || isChange.value) {
    visibleSave.value = true;
    return false;
  } else {
    deploymentRef.value.selectId = id;
  }

  selectedId.value = id.slice(0, id.indexOf('$'));
  selectedName.value = id.slice(id.indexOf('$')+1);
  //获取单个合约的最新编排信息
  await getSingleContractInfo();
  //设置abliInfo数据
  setAbiInfo(abiInfo, selectedName.value, 'all');
  //Invoke Contract Method字段赋值
  setFunctionParamsValue(); 
  //Contract Parameters 清空字段验证 
  await paramsRef.value.formContractRef.clearValidate();
  //Invoke Contract Method 清空字段验证
  //获取子组件的表单ref值
  let invokeChild = contractRef.value.formInvokeRef;
  if (invokeChild != undefined) {
    for (let i = 0; i < invokeChild.length; i++){
      await invokeChild[i].clearValidate();
    }
  }
  disabledSave.value = false;
}

//拆分保存的合约信息
const setSingleContractArrange = () => {
  if (contractSingileInfo.value != null && Object.keys(contractSingileInfo.value).length > 0) {
    emptyFormValue();
    contractSingileInfo.value.deployStep.forEach((element:any) => {
      checked.value = element.contract.proxy; //Proxy Contract
      element.steps.forEach((item: any, key: any) => {
        if (key === 0) { //Contract Parameters
          paramFormValue.value = item.params;
        } else {
          methodFormValue.value.push(item);
        }
      });
    });
  }
}

//设置abiInfo数据格式
const setAbiInfo = (abiInfo: any, mapKey: string, setType: string) => {
  if (setType !== 'method') {
    paramInputData.value = [];
  }
  if (!methodMap.get(mapKey)) {
    methodInputData.value = [];
    methodFunctionData.value = [];
    methodFormList.val = {};
  }
  
  let abiInfoData = YAML.parse(abiInfo);
  
  abiInfoData.map((item: any) => {
    if (item.type === 'constructor' && setType !== 'method') {
      setConstructorParams(item);
    } else if (item.type === 'function') {
      setFunctionParams(item, mapKey);
    }
  }) 
  methodFunctionData.value.sort(); //排序
  //记录整理得数据
  methodMap.set(mapKey, {
    formList: methodFormList.value, //记录表单字段
    inputData: methodInputData.value, //记录表单标签
    functionData: methodFunctionData.value //记录function 类型
  });
  console.log("methodMap:",methodMap);
}

//设置Contract Parameters字段
const setConstructorParams = (item:any) => {
  let param: any = { param1: 1, address: '' };
  //给address赋值
  if (paramFormValue.value.length > 0) {
    let addressVal = paramFormValue.value[0];
    if (addressVal.indexOf('$') !== -1) {
      param.param1 = 1;
      param.address = addressVal.slice(1, addressVal.indexOf('.'));
    } else {
      param.param1 = 2;
      param.address = addressVal;
    }
  }
  //获取inputs字段
  if (item.inputs.length > 0) {
    paramInputData.value = item.inputs;
    item.inputs.forEach((it: any, k: any) => {
      if (paramFormValue.value.length > 0) {
        param[it.name] = paramFormValue.value[k+1]; //给字段赋值
      } else {
        param[it.name] = "";
      }
    })
  }
  paramFormData.value = param;
}
//设置Invoke Contract Method字段
const setFunctionParams = (item: any, mapKey: any) => {
  if (!methodMap.get(mapKey)) {
    let param: any = {};
    if (item.inputs.length > 0) {
      methodFunctionData.value.push(item.name);
      methodInputData.value[item.name] = item.inputs;
      item.inputs.forEach((it: any, k: any) => {
        param[it.name] = "";
      })
      methodFormList.value[item.name] = param;
    }
  }
}
// Invoke Contract Method字段赋值
const setFunctionParamsValue = () => {
  if (methodFormValue.value.length > 0) {
    methodFormValue.value.forEach((item: any) => {
      //保存的合同，字段没有进行整理
      if (!methodMap.get(item.contractName)) { 
        contractOrchestration.value.forEach((element: any) => {
          if (element.name === item.contractName) {
            setAbiInfo(element.abiInfo, item.contractName, 'method');
          }
        });
      }
      //初始化字段值
      let param: any = {
        methodName: item.contractName,
        methodType: item.method,
        param1: 1,
        address: '',
        customParams: '',
      };
      
      //给自定义字段赋值
      let custObj = JSON.parse(item.value);
      let str = '';
      Object.keys(custObj).forEach(key => {
        str += `${key}: ${custObj[key]}\n`;
      })
      param.customParams = str;
      //给address赋值
      let addressVal = item.params[0];
      if (addressVal.indexOf('$') !== -1) {
        param.param1 = 1;
        param.address = addressVal.slice(1, addressVal.indexOf('.'));
      } else {
        param.param1 = 2;
        param.address = addressVal;
      }
      //获取inputs字段
      let inputs = methodMap.get(item.contractName).inputData[item.method];
      inputs.forEach((it: any, k: any) => {
        param[it.name] = item.params[k+1];
      })
      contractRef.value.methodList.push({formData: param});  
    });
    contractRef.value.showMethod = true;

    console.log("mothodList::",contractRef.value.methodList);
  }
}

//设置save按钮
const setDisabledSave = (val: boolean) => {
  disabledSave.value = val;
}
//设置address得值
const setAddressValue = (param1: number, address: string) => {
  let addressVal = '';
  if (param1 == 1) { //Select project contract
    if (address) {
      addressVal = '$'+ address + '.address';
    }
  } else { //Manual input
    addressVal = address;
  }
  return addressVal;
}
//Contract Parameters
const setContractParams = () => {
  let params = [];
  //设置address得值
  let addVal = setAddressValue(paramFormData.value.param1, paramFormData.value.address);
  params.push(addVal);
  //按照顺序获取字段值
  paramInputData.value.map((item: any) => {
    params.push(paramFormData.value[item.name]);
  });
  return {
    type: checked.value ? PROXY_CONSTRUCTOR  : CONSTRUCTOR,
    method: "",//都是空串
    params: params,
    status: "PENDDING",//所有pendding
  };
}
//拆分自定义字段值
const setCustomParams = (customParams: string) => {
  let custParam: any = {}; //按照{key:value}格式整合数据
  let custStr = customParams.split('\n');
  custStr.forEach((element: any) => {
    if (element) {
      let paramStr: any = element.split(': ');
      custParam[paramStr[0]] = paramStr[1];
    }
  });
    
  return custParam;
}
//Invoke Contract Method
const setInvokeContractMethod = () => {
  let methodStep: any = [];
  let methodList = contractRef.value.methodList;
  methodList.map((item: any) => {
    let params = [];
    //设置address得值
    let addVal = setAddressValue(item.formData.param1, item.formData.address);
    params.push(addVal);
    //获取字段列表
    let inputList = methodMap.get(item.formData.methodName).inputData[item.formData.methodType];
    //按照顺序获取字段值
    inputList.map((item_input: any) => {
      params.push(item.formData[item_input.name]);
    });
    //拆分自定义字段值
    let custParam = setCustomParams(item.formData.customParams);
    //整合step数据格式
    methodStep.push({
      contractName: item.formData.methodName,
      type: FUNCTION,
      method: item.formData.methodType,
      params: params,
      value: JSON.stringify(custParam),//用户自定义输入
      status: "PENDDING", //所有pendding
    });
  });
  return methodStep;
}
//设置合同数据
const setContractInfo = () => {

  //Contract Parameters
  let contractParams = setContractParams();

  //Invoke Contract Method
  let contractMehtod = setInvokeContractMethod();

  let stepParam = [contractParams, ...contractMehtod];
  //数据格式整合
  let deployStep = {
    contract: {
      name: selectedName.value,
      address: '',
      proxyAddress: '',
      proxy: checked.value
    },
    steps: stepParam,
    status: 'PENDDING',
    step: 0
  };
  originalArrange.value = {
    deployStep: [deployStep],
    step: 0,
  }
}
//验证Invoke Contract Method表单
const checkContractForm = async () => {
  
  //Contract Parameters 字段非空验证
  await paramsRef.value.formContractRef.validate();
  //Invoke Contract Method 字段非空验证
  //获取子组件的表单ref值
  let invokeChild = contractRef.value.formInvokeRef;
  if (invokeChild != undefined) {
    for (let i = 0; i < invokeChild.length; i++){
      await invokeChild[i].validate();
    }
  }
}
//单个合同数据保存
const saveSingleContractInfo = async () => {
  //字段非空验证
  await checkContractForm();
 
  //设置合同数据
  setContractInfo();
  console.log("originalArrange.value::",originalArrange.value);

  let param = {
    projectId: route.query.id,
    contractId: Number(selectedId.value),
    contractName: selectedName.value,
    version: baseInfo.value.selectedVersion,
    originalArrange: JSON.stringify(originalArrange.value)
  }
  try {
    const res = await apiSaveSingleContractInfo(route.query.id, param);
    message.success(res.message);
  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    setSaveParamsValue()
  }
}

// 获取单个合约的最新编排信息  
const getSingleContractInfo = async () => {
  contractSingileInfo.value = {}; //清空合同信息
  try {
    let param = {
      id: route.query.id,
      projectId: route.query.id,
      contractId: Number(selectedId.value),
      contractName: selectedName.value,
      version: baseInfo.value.selectedVersion
    }
    const { data } = await apiGetSingleContractInfo(param.id, param.projectId, param.contractId, param.contractName, param.version);
    if (data != null && data != "") {
      contractSingileInfo.value = JSON.parse(data);
      //拆分保存的合约信息
      setSingleContractArrange();
    } else {
      emptyFormValue();
    }
    
    console.log("单个合约信息：", contractSingileInfo.value);
    
  } catch (error: any) {
    console.log("erro:", error)
  }
};

const emptyFormValue = () => {
  methodFormValue.value = [];
  paramFormValue.value = [];
  contractRef.value.methodList = [];
}

// 获取版本号
const getProjectsVersion = async () => {
  try {
    const { data } = await apiGetProjectsVersions({id: route.query.id});
    versionList.value = data
  } catch (error: any) {
    console.log("erro:", error)
  }
};

// 获取可编排的合约
const getProjectsContractName = async () => {
  try {
    const { data } = await apiWaitContractList(route.query.id, baseInfo.value.selectedVersion );
    contractOrchestration.value = data.useContract || [];
    noUseContract.value = data.noUseContract || []
    console.log('获取可编排的合约:', contractOrchestration.value)
  } catch (error: any) {
    console.log("erro:", error)
  }
};

// 获取合约详情
const getContactDetail = async () => {
  const res = await apiGetProjectsDetail(route.query.id)
  if (res.code === 200) {
    contractInfo.value = res.data
    console.log('获取合约详情:', res.data)
  }
}

const closeDeployContractsNumberModal = ()=>{
  visibleNumber.value = false
}

// 执行部署引擎
const goDeploy = ()=>{
  // 部署调用代码，引擎执行完成之后跳转url


  router.push(`/projects/projectsDeploymentDetail?id=${contractInfo.value.id}&version=${baseInfo.value.selectedVersion}`)
}

const deployManyContract = async () => {
  // 获取已经编排过的合约列表
  await getArrangeDeployList();
  // 保存编排信息
  await saveOrchestrationInfo();
  
  // 部署调用代码
  visibleNumber.value = true
}


const connectWallet = () => {
  showWallets.value?.onClickConnect();
}

const setWalletBtn = (val: boolean) => {
  isConnectedWallet.value = val;
}

watch(
  () => walletAddress.walletAddress || window.localStorage.getItem("walletAccount"),
  (oldValue, newV) => {
    if (oldValue) {
      isConnectedWallet.value = true;
      walletAccount.value = oldValue;
    } else {
      isConnectedWallet.value = false
    }
  }, { deep: true, immediate: true }
);

const getEVMNetwork = async()=>{
  const res = await apiEvmNetwork()
  networkListData.value = res.data
  console.log('getEVMNetwork:',res)
}

// 获取已经编排过的合约列表
const getArrangeDeployList = async()=>{
  const res = await apiArrangeDeployList(route.query.id, baseInfo.value.selectedVersion)
  console.log('获取已经编排过的合约列表:', res)
  if (res.code == 200) {
    let deployStep: any = [];
    res.data.forEach((item: any) => {
      if (item != '') {
        let strList = JSON.parse(item);
        strList.deployStep.forEach((sub: any) => {
          deployStep.push(sub);
        });
      }
    });
    numberValue.value = deployStep.length;
    deployArrange.value = {
      deployStep: deployStep,
      step: 0,
    }
    console.log("deployArrange::",deployArrange.value);
  }
}

const saveOrchestrationInfo = async () => {
  let param = {
    projectId: route.query.id,
    version: baseInfo.value.selectedVersion,
    originalArrange: JSON.stringify(deployArrange.value),
  }
  const res = await apiSaveOrchestrationInfo(route.query.id, param);
  console.log("saveOrchestrationInfo::",res);
}

onMounted(async () => {
  await getContactDetail()
  await getProjectsVersion()
  await getProjectsContractName()
  initBreadCrumb()

  if (showFooter) { // Deploy Setting 默认选中第一个数据
    if (contractOrchestration.value.length > 0) {
      let itemVal = contractOrchestration.value[0];
      selectContractId(itemVal.id+'$'+itemVal.name, itemVal.abiInfo)
    }
  }else{
    await getEVMNetwork()
  }
})

</script>

<style lang='less' scoped>
.ant-btn {
  height: 43px;

  &:first-child {
    margin-right: 24px;
  }
}

.ant-switch {
  margin-top: 8px;
}

//  ant-switch

.ant-switch {
  background-color: #f0f0f0;

  &.ant-switch-checked {
    background-color: #E2B578;

    &:hover {
      box-shadow: 0 0 0 2px #E2B578;
    }

    &:focus {
      box-shadow: 0 0 0 2px #E2B578;
    }
  }

}
</style>#E2B578