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
          <a-select v-model:value="formState.chain" style="width: 100%" placeholder="Please select">
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


  <starkNetModal :starknetVisible="starknetVisible" :deployTxHash="deployTxHash" @cancelModal="cancelStarkNetModal">
  </starkNetModal>
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
import starkNetModal from "../components/starkNetModal.vue";
import { useThemeStore } from "@/stores/useTheme";
import { useDeployAddressStore } from "@/stores/useDeployAddress";
import { useI18n } from 'vue-i18n';
import { apiGetProjectsContract, apiGetProjectsVersions } from "@/apis/workFlows";
import { apiProjectsContractDeploy, apiGetProjectsDetail, apiContractDeployId } from "@/apis/projects";
import { Provider, Account, Contract, ec } from "starknet";
import { connect, getStarknet } from "@argent/get-starknet";
import { ContractFrameTypeEnum } from "@/enums/frameTypeEnum";

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
    // console.log(response.transaction_hash)
    // console.log(response.contract_address)
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
    // router.push(`/projects/${queryParams.id}/contracts-details/${queryParams.version}`)

  } catch (err: any) {
    loading.value = false
    // console.log('err:', err)
  }
};


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
    // if (typeof (item) === 'object') {
    //   item.abiInfoData = [YAML.parse(item.abiInfo)];
    // } else {
    //   item.abiInfoData = YAML.parse(item.abiInfo);
    // }
    item.abiInfoData = YAML.parse(item.abiInfo);
    setAbiInfo(item);
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
    abi[0], // abi[0] 是一个数组，原因未知
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

const cancelStarkNetModal = () => {
  starknetVisible.value = false;
  hasDeclareHash.value = false;
}

const switchToChain = (chainId: string) => {
  window.ethereum && window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: `0x${chainId}` }],
  }).then((res: any) => {
    message.success('success')
    // console.info(res, '成功')
  }).catch((err: any) => {
    message.success('faild')
    // console.info(err, 'err')
  })
}

const setProjectsContractDeploy = async (chinaId: string, address: string, contractId: number) => {
  const network: any = networkData.find(item => { return item.id === formState.network })
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

  } else {
    // 有值说明已连接钱包
    const isWalletAccount = window.localStorage.getItem("alreadyConnectedWallets");
    if (isWalletAccount == null || isWalletAccount === '[]') {
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
  console.log(val, 'val')
};

const changeVersion = (val: string) => {
  queryParams.version = val
  getProjectsContract()
}

const getProjectsDetail = async () => {
  try {
    const { data } = await apiGetProjectsDetail(queryParams.id);
    frameType.value = data.frameType;
    if (frameType.value === 4) {
      Object.assign(chainData, ['StarkWare'])
      Object.assign(networkData, [{ name: 'Mainnet', id: '1', networkName: 'mainnet-alpha' }, { name: 'Testnet', id: '2', networkName: 'goerli-alpha' }, { name: 'Testnet2', id: '3', networkName: 'goerli-alpha-2' }])
      const data = await connectWallet();
      Object.assign(starkWareData, data)
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
