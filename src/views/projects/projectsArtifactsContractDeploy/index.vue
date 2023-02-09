<template>
  <Breadcrumb :currentName="projectName" :isClick="loading">
    <template v-slot:tags>
      <span
        class="dark:text-white text-[#151210] text-[14px] px-[16px] py-[6px] ml-[16px] border border-solid border-[#EBEBEB] rounded-[32px]">Contract</span>
    </template>
  </Breadcrumb>
  <div
    class="artifactsDeploy dark:bg-[#1D1C1A] bg-[#FFFFFF] dark:text-white text-[#121211] grid grid-cols-5 gap-4 p-[32px] rounded-[12px] mt-[24px]">
    <a-form class="dark:text-white text-[#121211] col-span-3" ref="formRef" :model="formState" name="basic"
      :label-col="{ span: 0 }" :wrapper-col="{ span: 18 }" autocomplete="off" noStyle>
      <div class="text-[16px] font-bold mb-[16px]">Contract</div>
      <a-form-item class="" name="version" :rules="[{ required: true, message: 'Please input your Version!' }]">
        <div class="dark:text-white text-[#121211] mb-[12px]">Version</div>
        <a-select v-model:value="formState.version" style="width: 100%" placeholder="请选择" @change="changeVersion">
          <a-select-option :value="item" v-for="item in versionData" :key="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="name" class="name-item" :rules="[{ required: true, message: 'Please input your Name!' }]">
        <div class="dark:text-white text-[#121211] mb-[12px]">Name</div>
        <a-checkbox-group class="dark:text-white text-[#121211]" :class="theme.themeValue === 'dark' ? 'dark-css' : ''"
          v-model:value="formState.name" name="checkboxgroup" :options="projectsContractData">
        </a-checkbox-group>
      </a-form-item>
      <a-form ref="modalFormRef" class="modalFormRef col-span-3 mb-[16px]" :model="modalFormState" name="userForm"
        :label-col="{ span: 0 }" :wrapper-col="{ span: 18 }" autocomplete="off" noStyle>
        <a-form-item :name="item.name" :rules="[{ required: true }]" v-for="item in abiInputData" class="">
          <a-input v-model:value="modalFormState[item.name]" :placeholder="'Please input ' + item.name" allowClear
            :class="theme.themeValue === 'dark' ? 'dark-css' : ''" />
        </a-form-item>
      </a-form>
      <div class="text-[16px] font-bold mb-[16px]">Network / Chain</div>
      <a-form-item name="chain" :rules="[{ required: true, message: 'Please input your Chain!' }]">
        <div class="dark:text-white text-[#121211] mb-[12px]">Chain</div>
        <a-select v-model:value="formState.chain" style="width: 100%" placeholder="Please select">
          <a-select-option :value="item" v-for="item in chainData" :key="item">{{ item }}</a-select-option>
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
      <a-button class="btn" @click="deployClick" :loading="loading">{{ loading? 'Deploying': 'Deploy' }}</a-button>
    </a-form>
  </div>

  <SelectWallet :visible="visible" @cancelModal="cancelModal"></SelectWallet>
  <Wallets ref="showWallets"></Wallets>
</template>
<script lang='ts' setup>
import { reactive, ref, onMounted } from "vue";
import type { FormInstance } from 'ant-design-vue';
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import * as ethers from "ethers";
import YAML from "yaml";
import Breadcrumb from "../components/Breadcrumb.vue";
import SelectWallet from "./components/SelectWallet.vue";
import Wallets from "@/components/Wallets.vue";
import { useThemeStore } from "@/stores/useTheme";
import { apiGetProjectsContract, apiGetProjectsVersions } from "@/apis/workFlows";
import { apiProjectsContractDeploy } from "@/apis/projects";

const formRef = ref<FormInstance>();
const modalFormRef = ref<FormInstance>();
const theme = useThemeStore();
const router = useRouter();
import { useI18n } from 'vue-i18n';
const { t } = useI18n()


const queryParams = reactive({
  id: router.currentRoute.value.params?.id,
  version: router.currentRoute.value.params?.version,
  contract: router.currentRoute.value.params?.contract,
})

const loading = ref(false);
const visible = ref(false)
const showWallets = ref();
const versionData = reactive([]);
const chainData = reactive(['Ethereum']);
const networkData = reactive([{ name: 'Testnet/Goerli', id: '5' }, { name: 'mainnet', id: '1' }]);
const projectsContractData = reactive([]);
const projectName = ref('');
const abiInputData = ref([]);

const formState = reactive({
  version: router.currentRoute.value.params?.version,
  name: [],
  chain: undefined,
  network: undefined,
});

const modalFormState = ref({});

// 查询版本号
const getVersion = async () => {
  const { data } = await apiGetProjectsVersions({ id: queryParams.id });
  Object.assign(versionData, data)
}

const getProjectsContract = async () => {
  const { data } = await apiGetProjectsContract({ id: queryParams.id, version: queryParams.version });
  data.map((item: any) => {
    item.label = item.name;
    item.value = item.id;
    item.abiInfoData = YAML.parse(item.abiInfo);
    setAbiInfo(item);
  })
  Object.assign(projectsContractData, data)
  if (queryParams.contract === '00') {
    data.map((item: any) => {
      formState.name.push(item.id)
    })
  } else {
    formState.name.push(Number(queryParams?.contract))
  }
}


//  创建合约
const contractFactory = async (abi: any, bytecode: any, contractId: number) => {
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
    // ...(Object.values(modalFormState.value))  参数值
    const values: any = modalFormState.value || {};
    const contract = await factory.deploy(...Object.values(values));
    await contract.deployed();
    // console.log(contract, 'contract')
    return setProjectsContractDeploy(ethereum.chinaId, contract.address, contractId)
  } catch (errorInfo) {
    // 失败的处理
    // console.log(errorInfo, 'errorInfo')
    message.error(t('common.operateFail'));
  }
}

const switchToChain = (chainId: string) => {
  window.ethereum && window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${chainId}` }],
  }).then((res: any) => {
    message.success('success')
    console.info(res, '成功')
  }).catch((err: any) => {
    message.success('faild')
    console.info(err, 'err')
  })
}

const setProjectsContractDeploy = async (chinaId: string, address: string, contractId: number) => {
  const network = networkData.find(item => { return item.id === formState.network })
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

const deployClick = async () => {
  // 有值说明已连接钱包
  const isWalletAccount = window.localStorage.getItem("alreadyConnectedWallets");
  if (isWalletAccount == null || isWalletAccount === '[]') {
    // visible.value = true
    showWallets.value?.onClickConnect();

    // setWalletBtn(true)
  } else {
    // 连接钱包后再创建合约
    try {
      const values = await formRef?.value.validateFields();
      const modalValues = await modalFormRef?.value.validateFields();
      const { name } = formState;
      const { ethereum } = window;
      const network = `0x${formState.network}`
      if (ethereum.chainId !== network) {
        switchToChain(formState.network)
      } else {
        setContractFactory(name)
      }
    } catch (errorInfo) {
      // 表单校验
      console.log('Failed:', errorInfo);
    }
  }
}


const setContractFactory = async (name: any) => {
  // console.log(name, 'name')
  let promise: any = [];
  name.map((item: number) => {
    let selectItem: any = projectsContractData.find(val => { return val.id === item });
    // const byteCode = selectItem.byteCode.includes('__') ? selectItem.byteCode.split('__')[0] : selectItem.byteCode
    promise.push(contractFactory(selectItem.abiInfoData, selectItem.byteCode, item));
  })
  const res = await Promise.all(promise)
  loading.value = false;
  const result = res.some(it => {
    return it !== undefined
  })
  result ? router.push(`/projects/${queryParams.id}/contracts-details/${queryParams.version}`) : loading.value = false
}

const setAbiInfo = (selectItem: any) => {
  // console.log(selectItem)
  selectItem.abiInfoData.map((item: any) => {
    if (item.type === 'constructor') {
      abiInputData.value = item.inputs
    }
  })
}

const cancelModal = (val: boolean) => {
  visible.value = val
}

const changeVersion = (val: string) => {
  // console.log(val, 'val')
  queryParams.version = val
  getProjectsContract()
}

onMounted(async () => {
  projectName.value = localStorage.getItem("projectName") || '';
  getVersion()
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

:deep(.ant-form label) {
  color: #121211;
  margin-bottom: 16px;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

.btn {
  width: 131px;
  height: 43px;
}

:deep(.ant-checkbox-wrapper-checked:hover) {
  border-radius: 4px;
}

:deep(.ant-checkbox-checked+span) {
  color: #E2B578;
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
</style>
