<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <bread-crumb :routes="breadCrumbInfo" />
    <DeployVersionInfomation ref="baseInfo" :versionList="versionList" :name="contractInfo.name" />
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
          <DeploymentOrder v-if="contractOrchestration.length" @selectContractId="selectContractId" :contractOrchestration="contractOrchestration"></DeploymentOrder>
        </div>
        <!-- right -->
        <div>
          <ContractParams :contractOrchestration="contractOrchestration" :selectedId="selectedId" :inputData="paramInputData" :formData="paramFormData"></ContractParams>
          <InvokeContract ref="contractRef" :contractOrchestration="contractOrchestration" :selectedId="selectedId" :methodMap="methodMap" @setAbiInfo="setAbiInfo" @setDisabledSave="setDisabledSave"></InvokeContract>
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
      <div class="h-[1px] my-[32px] border border-solid dark:border-[#434343] border-[#EBEBEB]"></div>
      <div>
        <div class="text-[24px] font-bold">Network / Chain</div>
        <div class="mt-[10px] mb-[20px]">Select a network to deploy this contract on. We recommend starting with a
          testent
        </div>
        <div class="flex justify-between">
          <a-select ref="select" v-model:value="value1" style="width: 50%" @change="changeContractVersion"
            :options="networkListData.map(item => ({ value: item.name }))">
          </a-select>
          <div>
            <a-button @click="connectWallet">Connect Wallet</a-button>
            <a-button @click="deployManyContract">Deploy Now</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <UsingWalltModal /> -->
  <!-- <CustomParamsmodal /> -->
  <!-- <DeploymentOrchestrationmodal /> -->
  <!-- <Wallets ref="showWallets"></Wallets> -->
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import YAML from "yaml";
import { useRoute, useRouter } from 'vue-router';
import { useThemeStore } from "@/stores/useTheme";
import BreadCrumb from "@/components/BreadCrumb.vue";
import DeployVersionInfomation from '@/components/DeployVersionInfomation.vue';
import ContractParams from './components/ContractParams.vue';
import InvokeContract from './components/InvokeContract.vue';
import UsingWalltModal from "./components/UsingWalltModal.vue";
import CustomParamsmodal from "./components/CustomParamsmodal.vue";
import DeploymentOrchestrationmodal from "./components/DeploymentOrchestrationmodal.vue";
import Wallets from "@/components/Wallets.vue";
import DeploymentOrder from "./components/DeploymentOrder.vue";
import { apiGetProjectsDetail } from '@/apis/projects'
import { apiGetProjectsContract, apiGetProjectsVersions } from "@/apis/workFlows";
import { apiSaveSingleContractInfo } from "@/apis/contractOrchestrationDeploy";

const theme = useThemeStore();
const value1 = ref<string>('Ethereum/Mainnet');
const checked = ref<boolean>(false);
const breadCrumbInfo = ref<any>([]);
const versionList = ref();
const selectedId = ref('');
const route = useRoute()
const router = useRouter()
const showWallets = ref();
// 合约信息对象
const contractInfo = ref<any>({})
// 待编排部署的合约
const contractOrchestration = ref<any>([])
const baseInfo = ref()

const networkListData = ref([{ name: 'Ethereum/Mainnet', id: '1' }, { name: 'Ethereum/Goerli', id: '5' }, { name: 'Ethereum/Sepolia', id: 'aa36a7' }])

const disabledSave = ref(true);
const contractRef = ref();
const methodMap = new Map();
const paramFormData = ref({});
const paramInputData = ref<any>([]); //记录合同Contract Parameters字段
const methodFormList = ref<any>({});
const methodInputData = ref<any>([]); //记录合同Invoke Contract Method字段
const methodFunctionData = ref<any>([]);


const changeChecked = (val: any) => {
  console.log(val, 'switch')
}

const changeContractVersion = (val: any) => {
  console.log(val, 'version')
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

const selectContractId = (id: string, abiInfo: any) => {
  selectedId.value = id;
  setAbiInfo(abiInfo, id, 'all');
}

//设置abiInfo数据格式
const setAbiInfo = (abiInfo: any, mapKey: string, setType: string) => {
  if (setType !== 'method') {
    paramInputData.value = [];
  }
  emptyMethodData();
  let abiInfoData = YAML.parse(abiInfo);
  
  abiInfoData.map((item: any) => {
    if (item.type === 'constructor' && setType !== 'method') {
      let param:any = {param1: 1,address: ''};
      if (item.inputs.length > 0) {
        paramInputData.value = item.inputs;
        item.inputs.forEach((it: any) => {
          param[it.name] = "";
        })
      }
      paramFormData.value = param;
    } else if (item.type === 'function') {
      // let param:any = {methodName:selectedId.value,methodType: '',param1: 1,address: ''};
      if (!methodMap.get(mapKey)) {
        let param: any = {};
        if (item.inputs.length > 0) {
          methodFunctionData.value.push(item.name);
          methodInputData.value[item.name] = item.inputs;
          item.inputs.forEach((it: any) => {
            param[it.name] = "";
          })
          methodFormList.value[item.name] = param;
        }
      }
    }
  }) 
  methodFunctionData.value.sort(); //排序
  if (!methodMap.get(mapKey)) {
    methodMap.set(mapKey, {
      formList: methodFormList.value,
      inputData: methodInputData.value,
      functionData: methodFunctionData.value
    });
  }

  console.log("methodMap::",methodMap);
}

const emptyMethodData = () => {
  methodInputData.value = [];
  methodFunctionData.value = [];
  methodFormList.val = {};
}
//设置save按钮
const setDisabledSave = (val: boolean) => {
  disabledSave.value = val;
}
//设置合同数据
const setContractInfo = () => {
  console.log("paramFormData:::", paramFormData.value);
  console.log("paramInputData:::", paramInputData.value);
  console.log("methodList:::", contractRef.value.methodList)
  console.log("contractOrchestration:::",contractOrchestration.value);

  let params = [];
  paramInputData.value.map((item: any) => {
    
  });
}
//单个合同数据保存
const saveSingleContractInfo = async () => {
  //设置合同数据
  setContractInfo();

  // let param = {
  //   projectId: route.query.id,
  //   contractId: selectedId.value,
  //   contractName: '',
  //   version: baseInfo.value.selectedVersion,
  //   originalArrange: ''
  // }
  // try {
  //   const { data } = await apiSaveSingleContractInfo(route.query.id, param);
  //   versionList.value = data
  // } catch (error: any) {
  //   console.log("erro:", error)
  // }
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
    const { data } = await apiGetProjectsContract({ id: route.query.id, version: baseInfo.value.selectedVersion });
    contractOrchestration.value = data
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

const deployManyContract = async () => {
  // 部署调用代码

  router.push(`/projects/projectsDeploymentDetail?id=${contractInfo.value.id}`)
}


const connectWallet = () => {
  // const walletAccount = window.localStorage.getItem("walletAccount");
  // if (walletAccount === undefined || walletAccount === null) {
  //   showWallets.value?.onClickConnect();
  // } else{
  // 
  // }
}

onMounted(async () => {
  await getContactDetail()
  getProjectsVersion()
  getProjectsContractName()
  initBreadCrumb()
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