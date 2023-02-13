<template>
  <Breadcrumb :currentName="projectName" :isClick="loading">
    <template v-slot:tags>
      <span
        class="dark:text-white text-[#151210] text-[14px] px-[16px] py-[6px] ml-[16px] border border-solid border-[#EBEBEB] rounded-[32px]">Contract</span>
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
            <a-select-option :value="item" v-for="item in versionData" :key="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="nameData" class="name-item"
          :rules="[{ required: true, message: 'Please input your Name!' }]">
          <div class="dark:text-white text-[#121211] mb-[12px]">Name</div>
          <!-- <div
            class="flex justify-between border border-solid dark:border-[#434343] border-[#EFEFEF] rounded-[8px] px-[12px] py-[9px]"> -->
          <!-- <a-checkbox-group class="dark:text-white text-[#121211]"
            :class="theme.themeValue === 'dark' ? 'dark-css' : ''" v-model:value="formState.name" name="checkboxgroup"
            :options="projectsContractData">
            <img v-show="hasArgument" src="@/assets/icons/cname.svg" />
            <template>

            </template>
          </a-checkbox-group> -->

          <!-- </div> -->

          <a-checkbox-group class="dark:text-white text-[#121211] w-full" @change="hchange"
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
      </a-form>
      <div class="col-span-2 m-auto">
        <img src="@/assets/images/deployDetail.png" class="w-full" />
      </div>
    </div>
    <div class="text-center mt-[16px]">
      <a-button class="btn" @click="deployClick" :loading="loading">{{
        loading? 'Deploying': 'Deploy'
      }}</a-button>
    </div>
  </div>
  <SelectWallet :visible="visible" @cancelModal="cancelModal"></SelectWallet>
  <Wallets ref="showWallets"></Wallets>

  <!-- <a-modal v-model:visible="margumentVisible" title="Contract Metadata" :footer="null" @cancel="handleCancel">
    <template #closeIcon>
      <img class="" src="@/assets/icons/closeIcon.svg" />
    </template>
    <a-form ref="modalFormRef" class="modalFormRef col-span-3 mb-[16px]"
      :model="projectsContractData[selectedIndex].modalFormData" name="userForm" :label-col="{ span: 0 }"
      :wrapper-col="{ span: 24 }" autocomplete="off" noStyle>
      <a-form-item class="mb-[32px]" :name="item.name" v-for="item in abiInputData">
        <div class="text-[#151210] mb-[12px]">{{ item.name }}</div>
        <a-input v-model:value="projectsContractData[selectedIndex].modalFormData[item.name]"
          :placeholder="'Please input ' + item.name" allowClear />
      </a-form-item>
    </a-form>
    <div class="text-center">
      <a-button class="done-btn" @click="getModalData">Done</a-button>
    </div>
  </a-modal> -->

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

const argsMap = new Map();
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
const chainData = reactive(['Ethereum']);
const networkData = reactive([{ name: 'Testnet/Goerli', id: '5' }, { name: 'mainnet', id: '1' }]);
const projectsContractData = reactive([]);
const projectName = ref('');
const abiInputData = ref([]);

const formState = reactive({
  version: router.currentRoute.value.params?.version,
  nameData: [],
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

const hchange = (val: any) => {
  console.info(val, '090')
}

const handleCancel = () => {
  let data = projectsContractData[selectedIndex.value].modalFormData
  for (let key in data) {
    data[key] = undefined
  }
}

const getProjectsContract = async () => {
  const { data } = await apiGetProjectsContract({ id: queryParams.id, version: queryParams.version });
  data.map((item: any) => {
    item.label = item.name;
    item.value = item.id;
    item.modalFormData = reactive({});
    item.abiInfoData = YAML.parse(item.abiInfo);
    setAbiInfo(item);
  })
  Object.assign(projectsContractData, data)
  // console.log(projectsContractData, '999')
  // if (queryParams.contract === '00') {
  //   data.map((item: any) => {
  //     formState.name.push(item.id)
  //   })
  // } else {
  //   formState.name.push(Number(queryParams?.contract))
  // }
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


const setContractFactory = async (nameData: any) => {
  let promise: any = [];
  nameData.map((item: number) => {
    formState.name.push(item.id);
    let selectItem: any = projectsContractData.find(val => { return val.id === item.id });
    // console.log(selectItem, 'selectItem')
    // const byteCode = selectItem.byteCode.includes('__') ? selectItem.byteCode.split('__')[0] : selectItem.byteCode
    promise.push(contractFactory(selectItem.abiInfoData, selectItem.byteCode, argsMap.get(selectId.value), item.id));
    // console.log(abiInputData.value, '000')
  })
  const res = await Promise.all(promise)
  loading.value = false;
  const result = res.some(it => {
    return it !== undefined
  })
  result ? router.push(`/projects/${queryParams.id}/contracts-details/${queryParams.version}`) : loading.value = false
}

const setAbiInfo = (selectItem: any) => {
  const constructorData = selectItem.abiInfoData.find((item: any) => { return item.type === 'constructor' })
  if (constructorData && constructorData.inputs.length > 0) {
    selectItem.hasArgument = true;
  }
  // selectItem.hasArgument = selectItem.abiInfoData.some((item: any) => { return item.type === 'constructor' });
  if (selectItem.hasArgument) {
    selectItem.hasModalFormData = true;
  }
  // console.log(selectItem, abiInputData.value, 'hasArgument.value')
}

const getModalData = async () => {
  try {
    const modalValues = await modalFormRef?.value.validateFields();

    // console.log(projectsContractData, 'pop')
    // projectsContractData[selectedIndex.value].data = projectsContractData[selectedIndex.value].modalFormData
    const value = Object.values(testData.value);
    formState.nameData.push(projectsContractData[selectedIndex.value]);
    projectsContractData[selectedIndex.value].hasModalFormData = false;
    // console.log(projectsContractData[selectedIndex.value].modalFormData, projectsContractData[selectedIndex.value], modalFormState.value)


    // let result = false
    // if (value.length > 0) {
    //   value.map((val: any) => {
    //     if (val && val != '') {
    //       result = true
    //     } else {
    //       result = false
    //     }

    //   })
    // } else {
    //   result = false
    // }

    // if (result) {
    //   formState.nameData.push(projectsContractData[selectedIndex.value]);
    //   projectsContractData[selectedIndex.value].hasModalFormData = false;
    //   // modalFormRef?.value.resetFields();
    // } else {
    //   projectsContractData[selectedIndex.value].hasModalFormData = true;
    // }


    margumentVisible.value = false;
    // console.log("testData2", testData.value);
    let data = Object.assign({}, testData.value)
    // console.log("DATA", data)
    argsMap.set(selectId.value, data)
  } catch (err: any) {
    projectsContractData[selectedIndex.value].hasModalFormData = true;
    console.info(err)
  }

  // const data = {}
  // Object.assign(data, projectsContractData[selectedIndex.value].modalFormData)
  // console.log(data, 'data')
  // projectsContractData[selectedIndex.value].modalFormData = modalFormState.value
  // projectsContractData[selectedIndex.value].modalFormData = modalFormState.value;
  // Object.assign(projectsContractData[selectedIndex.value].modalFormData, data)

  // console.log(projectsContractData, '9090');

};


const selectAargumentName = (val: any, index: number) => {
  // console.log(testData, 'testData')
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

      // testData["abiInputData.value"] = null;
    }
  })
}

const cancelModal = (val: boolean) => {
  visible.value = val
}

const changeVersion = (val: string) => {
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
