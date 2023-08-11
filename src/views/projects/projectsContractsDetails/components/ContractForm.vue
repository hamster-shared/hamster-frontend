<template>
  <a-form class="dark:text-white text-[#121211] col-span-3" ref="formRef" name="basic" :label-col="{ span: 0 }"
    :model="formData" :wrapper-col="{ span: 24 }" autocomplete="off" noStyle @submit="submit">
    <a-form-item>
      <div class="mb-[32px]">
        <div class="dark:text-white text-[#121211] text-[16px] font-blod leading-[43px]">{{ checkValue }}</div>
        <div class="dark:text-white text-[#121211] text-[12px] leading-[43px]">{{ subTitle }}</div>
      </div>
    </a-form-item>
    <div v-if="inputs?.length" v-for="(item,index) in inputs">
      <a-form-item class="" :name="item.name" :rules="[{ required: true, message: `Please input your ${item.name}` }]">
        <div class="mb-[12px]">
          <span class="dark:text-[#FFFFFF] text-[#151210] text-[16px] font-bold">{{ item.name || `params${index+1}` }}</span>
        </div>
        <a-input class="dark:text-white text-[121211]" :class="theme.themeValue === 'dark' ? 'dark-css' : ''"
          :placeholder= "'Enter a value for ' + (frameType === 4 ? item.type : item.internalType)" allowClear
          v-model:value="formData[item.name || `params${index+1}`]"></a-input>
      </a-form-item>
    </div>

      <div v-if="payable">
          <div class="mb-[12px]">
              <a-form-item class="" name="value" :rules="[{ required: false, message: `Please input your value` }]">
                <span class="dark:text-[#FFFFFF] text-[#151210] text-[16px] font-bold"> value </span>
                <div class="flex justify-between w-[100%]">
                  <a-input class="dark:text-white text-[121211] !w-[60%]" :class="theme.themeValue === 'dark' ? 'dark-css' : ''"
                         :placeholder= "'value to send '" allowClear v-model:value="payableValue"></a-input>
                  <a-select v-model:value="payUnit" class="!w-[20%]">
                      <a-select-option value="ether">ether</a-select-option>
                      <a-select-option value="finney">finney</a-select-option>
                      <a-select-option value="szabo">szabo</a-select-option>
                      <a-select-option value="gwei">gwei</a-select-option>
                      <a-select-option value="mwei">mwei</a-select-option>
                      <a-select-option value="kwei">kwei</a-select-option>
                      <a-select-option value="wei">wei</a-select-option>
                  </a-select>
                </div>
              </a-form-item>
          </div>
      </div>

    <a-button class="btn" :disabled="isSend" type="primary" html-type="submit" :loading="isSend">{{
        isSend ? buttonInfo + 'ing' : buttonInfo
      }}</a-button>
    <div class="mb-[24px] mt-[24px]">
      <div class="flex justify-between  mb-[12px]">
        <span class="dark:text-[#FFFFFF] text-[#151210]  text-[16px] font-bold">outputs</span>
        <span class="open-link-css text-[16px] cursor-pointer" @click="copy">
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
import { stark, number,uint256 } from "starknet";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { WalletCore } from '@aptos-labs/wallet-adapter-core';
import { AptosClient } from 'aptos'
const theme = useThemeStore();
const deployAddress = useDeployAddressStore();
const props = defineProps({
  contractAddress: String,
  checkValue: String,
  abiInfo: String,
  buttonInfo: String,
  frameType: {
    type: Number,
    required: true
  },
  payable: Boolean,
  inputs: { type: Array as any, default: () => { return [] } },
  outputs: { type: Array as any, default: () => { return [] } },
  aptosName: String,
  aptosAddress: String,
  subTitle:{
    type:String,
    default:''
  }
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

const payableValue = ref(0)
const payUnit = ref("ether")

// aptos
const arr = [new PetraWallet()]
const aptosWallet: any = new WalletCore(arr)
const aptosNetwork = ref('')

const testData = reactive({});

const formData = reactive<any>({});
const { checkValue, contractAddress, abiInfo, inputs,outputs, buttonInfo,frameType, aptosName, aptosAddress, subTitle } = toRefs(props)
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
    var calldata = stark.compileCalldata({})
    if (JSON.stringify(formData) != "{}") {
      calldata = stark.compileCalldata(formData)
    }
    const callResp = await deployAddress.deployAddressValue.account.callContract({
      entrypoint: checkValue?.value,
      contractAddress: contractAddress?.value,
      calldata: calldata,
    })
    if (callResp.result.length > 0) {
      callResp.result.forEach( (item:string,index:number) => {
        if (outputs?.value.length > 0) {
          if (outputs?.value.length > index) {
            const output = outputs?.value[index]
            if (output.type == 'felt') {
              if (isHexStringStringData(item)) {
                hashValue.value = hashValue.value + output.name + ": " + byteArrayToString(hexToByteArray(item)) + "\n"
              } else {
                hashValue.value = hashValue.value + output.name + ": " + parseInt(item, 16).toString() + "\n"
              }
            } else {
              hashValue.value = hashValue.value + output.name + ": " + parseInt(item, 16).toString() + "\n"
            }
          }
        } else {
          hashValue.value = callResp.result[0]
        }
      })
    }
    // const firstReturnData = callResp.result[0]
    // if (firstReturnData == "0x0") {
    //   hashValue.value = parseInt(firstReturnData, 16).toString()
    //   return
    // }
    // if (isHexStringStringData(firstReturnData)) {
    //   const data = byteArrayToString(hexToByteArray(firstReturnData))
    //   hashValue.value = data
    // } else {
    //   // hashValue.value = parseInt(firstReturnData, 16).toString()
    //   hashValue.value = number.toFelt(firstReturnData)
    // }
    // console.log(firstReturnData, number.toFelt(firstReturnData))
    // hashValue.value = number.toFelt(firstReturnData)
  } catch (err: any) {
    message.error(err.toString())
  } finally {
    isSend.value = false;
  }
}

function isHexStringStringData(hexString: string): boolean {
  const asciiString = hexString.slice(2).replace(/../g, char => String.fromCharCode(parseInt(char, 16)));
  const printableRegex = /^[\x20-\x7E]+$/;
  return printableRegex.test(asciiString);
}

function hexToByteArray(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
}

function byteArrayToString(byteArray: number[]): string {
  return String.fromCharCode(...byteArray);
}

const executeSet = async () => {
  isSend.value = true
  // console.log(formData, 'set')
  try {
    let callData: any = {}
    Object.assign(callData,formData)
    const amountToMint = uint256.bnToUint256(1);
    if (inputs?.value.length > 0) {
      inputs?.value.forEach((item: any) => {
        if (item.type == 'Uint256') {
          const amount = uint256.bnToUint256(parseInt(callData[item.name]));
          callData[item.name] = { type: 'struct', low: amount.low, high: amount.high }
        }
      })
    }
    const invokeResponse = await deployAddress.deployAddressValue.account.execute({
          contractAddress: contractAddress?.value,
          entrypoint: checkValue?.value,
          calldata: stark.compileCalldata(callData)},
    );
    // console.log(invokeResponse.transaction_hash)
    const receiptResponsePromise = await deployAddress.deployAddressValue.account.waitForTransaction(invokeResponse.transaction_hash, undefined, ['ACCEPTED_ON_L2'])
    // console.log(receiptResponsePromise, 'receiptResponsePromise')
    hashValue.value = invokeResponse.transaction_hash;
  } catch (err: any) {
    message.error(err.toString())
  } finally {
    isSend.value = false;
  }
}
const submit = async () => {
  const emptyInputs = inputs?.value.filter( (item: { name: string | number; }) => !formData[item.name]);
  if (emptyInputs.length > 0) {
    message.warning('Please enter the necessary parameters')
    return
  }
  // console.log(deployAddress.deployAddressValue, 'deployAddressValue')
  if (frameType?.value == 4) {
    // console.log(formState.frameType, 'formState.frameType')
    // console.log(formState.frameType, 'formState.frameType')
    if (JSON.stringify(deployAddress.deployAddressValue) == '{}') {
      const data1 = await connectWallet()
      Object.assign(testData, data1)
      // console.log(data1, 'data1')
      deployAddress.setDeployAddress(testData)
      if (buttonInfo?.value == "Call") {
        executeGet()
      } else {
        executeSet()
      }
    } else {
      if (buttonInfo?.value == "Call") {
        executeGet()
      } else {
        executeSet()
      }
    }
  } else {
    evmDeployFunction();
  }
}
// evm合约方法调用
const evmDeployFunction = () => {
  // debugger
  isSend.value = true
  const { ethereum } = window;
  let provider = new ethers.providers.Web3Provider(ethereum);
  let abi = YAML.parse(formState.abiInfo);
  try {
    if (frameType.value != 2) {
      let contract = new ethers.Contract(formState.contractAddress, abi, provider.getSigner());
      if (props.buttonInfo === 'Transact') {
        // send 方法
        console.log(...(Object.values(formData)), 'data')
        let newData:any = {};
        if (inputs?.value.length > 0) {
          inputs?.value.forEach((item: any) => {
            newData[item.name] = formData[item.name];
          })
        }

        const value = ethers.utils.parseUnits(payableValue.value+"",payUnit.value)

        console.log(newData,'---new');
        console.log('Transact传入的参数：',...(Object.values(newData)),formState.checkValue)
        contract[formState.checkValue](...(Object.values(newData)),{value: props.payable?value:0}).then((tx: any) => {
          tx.wait().then((result: any) => {
            // isSend.value = false;
            hashValue.value = tx.hash;
          }).catch((err: any) => {
            console.log(err, '调用失败err')
            message.error('调用失败')
            hashValue.value = 'No Data';
          }).finally(() => {
            isSend.value = false;
          })
        }).catch((err:any)=>{
          message.error(err.message)
          isSend.value = false;
        })
      } else {
          debugger
        contract[formState.checkValue](...(Object.values(formData))).then((tx: any) => {
          if (tx._isBigNumber) {
            hashValue.value = ethers.utils.formatEther(tx._hex);
          } else {
            hashValue.value = tx;
          }
          isSend.value = false;
        }).catch((e:any)=>{
          console.log('eeeeeeeeee',e)
          isSend.value = false;
        })
      }
    } else if (frameType.value == 2) {
      if (props.buttonInfo === 'Transact') {
        // aptos move send 回调
        console.log('aptosWallet~~~11111', aptosWallet._connected)
        if (aptosWallet._connected) {
          aptosSendAbiFn()
        } else {
          aptosWallet.connect("Petra").then(async () => {
            aptosNetwork.value = aptosWallet.network.name;
            aptosSendAbiFn()
          }).catch((err: any) => {
            isSend.value = false;
            console.log('err', err)
          })
        }
      } else {
        // aptos call abi
        if (aptosWallet._connected) {
          aptosCallAbiFn()
        } else {
          aptosWallet.connect("Petra").then(async () => {
            aptosNetwork.value = aptosWallet.network.name;
            aptosCallAbiFn()
          }).catch((err: any) => {
            isSend.value = false;
            console.log('err', err)
          })
        }
      }
    }
  } catch (errorInfo: any) {
    console.log('errorInfo:' + errorInfo)
    isSend.value = false;
    message.error('调用失败')
  }
}
const aptosSendAbiFn = async () => {
  try {
    const preload = {
      type: "entry_function_payload",
      function: `${aptosAddress?.value}::${aptosName?.value}::${formState.checkValue}`,
      arguments: [...(Object.values(formData))],
      type_arguments: []
    }
    console.log(preload, 'aptos move fn')
    const res = await aptosWallet.signAndSubmitTransaction(preload)
    console.log('res~~~~~', res)
    hashValue.value = res.hash
    isSend.value = false;
  } catch (error) {
    isSend.value = false;
  }

}
const aptosCallAbiFn = async () => {
  try {
    // NODE_URL 应该根据网络动态切换
    const NODE_URL = `https://fullnode.${aptosNetwork.value}.aptoslabs.com`;
    const petraClient = new AptosClient(NODE_URL);
    try{
      const res:any = await petraClient.getAccountResource(aptosWallet?._account?.address, `${aptosAddress?.value}::${aptosName?.value}::${formState.checkValue}`);
      console.log('res~~~~~',res)
      hashValue.value = JSON.stringify(res.data)
    }catch(err){
      isSend.value = false;
      console.log(err)
    }
  } catch (error) {
    console.log('aptos call error',error)
    isSend.value = false;
  }
}
const copy = () => {
  let inp = document.createElement("input");
  document.body.appendChild(inp);
  inp.value = hashValue.value;
  inp.select();
  document.execCommand("copy", false);
  inp.remove();
  message.success('copy success')
}
watch(
  () => props,
  (oldV, newV) => {
    if (newV) {
      let name = [...(Object.keys(formData))]
      let value = [...(Object.values(formData))]
      if (!isSend.value) {
        // formRef.value.resetFields();
        // formRef.value.resetFields();
        name.forEach((it: any) => {
          delete formData[it];
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

// :deep(.ant-btn-primary[disabled]) {
//   background-color: #E2B578;
//   color: #ffffff;
//   border-color: #E2B578;
// }

// :deep(.ant-btn-primary[disabled]:hover) {
//   background-color: #E2B578;
//   color: #ffffff;
//   border-color: #E2B578;
// }

// .ant-input-affix-wrapper {
//   background: transparent;
//   border-radius: 8px;
//   border: 1px solid #EBEBEB;
// }

// :deep(.ant-input) {
//   height: 32px;
//   background: transparent;
//   color: #121211;
// }

// :deep(.ant-input.ant-input-disabled) {
//   height: unset;
//   background: transparent;
//   color: #ffffff;
// }

// :deep(.ant-input[disabled]:hover) {
//   border-color: #E2B578;
// }

// html[data-theme="dark"] {
//   .ant-input-affix-wrapper {
//     border: 1px solid #302D2D;
//     color: #ffffff;
//   }
// }

// .dark-css {
//   :deep(.ant-input) {
//     color: #ffffff;
//   }
// }

// input::-webkit-input-placeholder,
// input:-moz-placeholder,
// input::-moz-placeholder,
// input:-ms-input-placeholder {
//   color: #E0DBD2;
// }
</style>
