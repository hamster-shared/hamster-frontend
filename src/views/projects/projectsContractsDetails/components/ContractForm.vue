<template>
  <a-form class="dark:text-white text-[#121211] col-span-3" ref="formRef" name="basic" :label-col="{ span: 0 }"
    :model="formData" :wrapper-col="{ span: 24 }" autocomplete="off" noStyle @submit="submit">
    <a-form-item>
      <div class="flex justify-between mb-[32px]">
        <span class="dark:text-white text-[#121211] text-[16px] font-blod leading-[43px]">{{ checkValue }}</span>
        <a-button class="btn" :disabled="isSend" type="primary" html-type="submit" :loading="isSend">{{
          isSend ? buttonInfo + 'ing' : buttonInfo
        }}</a-button>
      </div>
    </a-form-item>
    <div v-for="item in inputs">
      <a-form-item class="" :name="item.name" :rules="[{ required: true, message: `Please input your ${item.name}` }]">
        <div class="mb-[12px]">
          <span class="dark:text-[#FFFFFF] text-[#151210] text-[16px] font-bold">{{ item.name }}</span>
        </div>
        <a-input class="dark:text-white text-[121211]" :class="theme.themeValue === 'dark' ? 'dark-css' : ''"
          :placeholder="'Enter a value for ' + item.internalType" allowClear
          v-model:value="formData[item.name]"></a-input>
      </a-form-item>
    </div>
    <div class="mb-[24px]">
      <div class="flex justify-between  mb-[12px]">
        <span class="dark:text-[#FFFFFF] text-[#151210]  text-[16px] font-bold">outputs</span>
        <span class="text-[#E2B578] text-[16px] cursor-pointer" @click="copy">
          <img src="@/assets/icons/copy.svg" />
          copy</span>
      </div>
      <a-textarea class="dark:text-white text-[121211]" placeholder="" disabled :rows="4" v-model:value="hashValue"
        :class="theme.themeValue === 'dark' ? 'dark-css' : ''" ref="textareaRef" />
    </div>
  </a-form>
</template>
<script lang='ts' setup>
import { reactive, toRefs, watch, ref } from 'vue';
import { useThemeStore } from "@/stores/useTheme";
import { useDeployAddressStore } from "@/stores/useDeployAddress";
import * as ethers from "ethers";
import YAML from "yaml";
import { message } from 'ant-design-vue';
import { connect, getStarknet } from "@argent/get-starknet";
import { stark, number } from "starknet";
const theme = useThemeStore();
const deployAddress = useDeployAddressStore();

const props = defineProps({
  contractAddress: String,
  checkValue: String,
  abiInfo: String,
  buttonInfo: String,
  frameType: Number,
  inputs: { type: Array as any, default: () => { return [] } },

})
const isSend = ref(false);
const hashValue = ref('')
const formRef = ref();
const textareaRef = ref();
const formState = reactive({
  contractAddress: '',
  checkValue: '',
  abiInfo: '',
  frameType: Number,
});

const testData = reactive({});

const formData = reactive({});

const { checkValue, contractAddress, abiInfo, inputs, frameType } = toRefs(props)
Object.assign(formState, { contractAddress: contractAddress?.value, checkValue: checkValue?.value, abiInfo: abiInfo?.value, frameType: frameType?.value })
const connectWallet = async () => {
  const windowStarknet = await connect({
    include: ["argentX"],
  })
  await windowStarknet?.enable({ starknetVersion: "v4" })
  return windowStarknet
}

const executeGet = async () => {
  isSend.value = true
  try {
    const callResp = await deployAddress.deployAddressValue.account.callContract({
      entrypoint: formState.checkValue,
      contractAddress: formState.contractAddress,
      calldata: stark.compileCalldata({
      }),
    })
    const firstReturnData = callResp.result[0]
    // console.log(firstReturnData, number.toFelt(firstReturnData))
    hashValue.value = number.toFelt(firstReturnData)
  } catch (err: any) {
    message.error(err)
  } finally {
    isSend.value = false;
  }

}
const executeSet = async () => {
  isSend.value = true
  // console.log(formData, 'set')
  try {
    const invokeResponse = await deployAddress.deployAddressValue.account.execute({
      contractAddress: formState.contractAddress,
      entrypoint: formState.checkValue,
      calldata: stark.compileCalldata(formData)
    })
    // console.log(invokeResponse.transaction_hash)
    const receiptResponsePromise = await deployAddress.deployAddressValue.account.waitForTransaction(invokeResponse.transaction_hash, undefined, ['ACCEPTED_ON_L2'])
    // console.log(receiptResponsePromise, 'receiptResponsePromise')
    hashValue.value = invokeResponse.transaction_hash;
  } catch (err: any) {
    message.error(err)
  } finally {
    isSend.value = false;
  }


}


const submit = async () => {
  // console.log(deployAddress.deployAddressValue, 'deployAddressValue')
  if (formState.frameType == 4) {
    console.log(formState.frameType, 'formState.frameType')
    if (JSON.stringify(deployAddress.deployAddressValue) == '{}') {

      const data1 = await connectWallet()
      Object.assign(testData, data1)
      // console.log(data1, 'data1')
      deployAddress.setDeployAddress(testData)
      if (JSON.stringify(formData) == "{}") {
        executeGet()
      } else {
        executeSet()
      }
    } else {
      if (JSON.stringify(formData) == "{}") {
        executeGet()
      } else {
        executeSet()
      }
    }

  } else {
    isSend.value = true
    const { ethereum } = window;

    let provider = new ethers.providers.Web3Provider(ethereum);
    let abi = YAML.parse(formState.abiInfo);
    // const contractAddress = '0x0501Fcb528D4fDe11f6ab5D1a5bd7323d32CC71d';

    // console.log(formData, ...(Object.values(formData)), formState.checkValue, 'formData')
    try {
      let contract = new ethers.Contract(formState.contractAddress, abi, provider.getSigner());
      if (JSON.stringify(formData) == "{}") {

        contract[formState.checkValue]().then((tx: any) => {
          // console.log(tx, 'tx')
          isSend.value = false;
          hashValue.value = tx;
        }).catch((err: any) => {
          message.error('????????????')
          hashValue.value = 'No Data';
          isSend.value = false;
        })
      } else {
        contract[formState.checkValue](...(Object.values(formData))).then((tx: any) => {
          tx.wait().then((result: any) => {
            isSend.value = false;
            hashValue.value = tx.hash;
            // console.log(result, 'tx send success!')
          }).catch((err: any) => {
            message.error('????????????')
            hashValue.value = 'No Data';
          })
        }).catch((err: any) => {
          message.error('????????????')
          hashValue.value = 'No Data';
          isSend.value = false;
        })
      }
    } catch (errorInfo) {
      isSend.value = false;
      message.error('????????????')
      // console.log(errorInfo, 'errorInfo')
    }

  }
}

const copy = () => {
  let inp = document.createElement("input");
  document.body.appendChild(inp);
  inp.value = hashValue.value;
  inp.select();
  document.execCommand("copy", false);
  inp.remove();
  message.success('????????????')
}

watch(
  () => props,
  (oldV, newV) => {
    if (newV) {
      let name = [...(Object.keys(formData))]
      let value = [...(Object.values(formData))]

      if (!isSend.value) {
        name.forEach((it: any) => {
          delete formData[it]
        })
        hashValue.value = ''
      }

      Object.assign(formState, { contractAddress: contractAddress?.value, checkValue: checkValue?.value, abiInfo: abiInfo?.value })
    }
  }, { deep: true }
);
</script>
<style lang='less' scoped>
.btn {
  width: 131px;
  height: 43px;
}

:deep(.ant-btn-primary[disabled]) {
  background-color: #E2B578;
  color: #ffffff;
  border-color: #E2B578;
}

:deep(.ant-btn-primary[disabled]:hover) {
  background-color: #E2B578;
  color: #ffffff;
  border-color: #E2B578;
}

.ant-input-affix-wrapper {
  background: transparent;
  border-radius: 8px;
  border: 1px solid #EBEBEB;
}

:deep(.ant-input) {
  height: 32px;
  background: transparent;
  color: #121211;
}

:deep(.ant-input.ant-input-disabled) {
  height: unset;
  background: transparent;
  color: #ffffff;
}

:deep(.ant-input[disabled]:hover) {
  border-color: #E2B578;
}

html[data-theme="dark"] {
  .ant-input-affix-wrapper {
    border: 1px solid #302D2D;
    color: #ffffff;
  }
}

.dark-css {
  :deep(.ant-input) {
    color: #ffffff;
  }

  // :deep(.anticon.ant-input-clear-icon) {
  //   color: #E0DBD2;
  // }
}

input::-webkit-input-placeholder,
input:-moz-placeholder,
input::-moz-placeholder,
input:-ms-input-placeholder {
  color: #E0DBD2;
}
</style>