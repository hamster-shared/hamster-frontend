<template>
  <div
    class="contractList dark:text-white text-[#121211] grid grid-cols-3 gap-4 border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px]">
    <div class="contractList-left p-[32px]">
      <div class="mb-[64px]" v-if="sendAbis.length > 0">
        <div class="mb-[16px]">
          <img src="@/assets/icons/send-white.svg" class="mr-[8px] hidden dark:inline-block" />
          <img src="@/assets/icons/send-block.svg" class="mr-[8px] dark:hidden" />
          <span class="font-bold align-middle">Send</span>
        </div>
        <div>
          <div
            class="contractList-title dark:text-[#E0DBD2] text-[#73706E] h-[51px] leading-[51px] rounded-[12px] pl-[30px] cursor-pointer"
            :class="(checkValue === val.name && checkValueIndex === index || checkValue.substring(0, checkValue.indexOf('：')) == val.name) ? 'checked' : ''"
            v-for="(val, index) in sendAbis" :key="val.name" @click="checkContract(val.name, val, 'Transact', index)">
            {{ ellipsisFunction(val.name) }}</div>
        </div>
      </div>
      <div v-if="callAbis.length > 0">
        <div class="mb-[16px]">
          <img src="@/assets/icons/send-white.svg" class="mr-[8px] hidden dark:inline-block" />
          <img src="@/assets/icons/send-block.svg" class="mr-[8px] dark:hidden" />
          <span class="font-bold align-middle">Call</span>
        </div>
        <div>
          <div
            class="contractList-title dark:text-[#E0DBD2] text-[#73706E] h-[51px] leading-[51px] rounded-[12px] pl-[30px] cursor-pointer"
            :class="(checkValue === val.name && checkValueIndex === index || checkValue.substring(0, checkValue.indexOf('：')) == val.name) ? 'checked' : ''"
            v-for="(val, index) in callAbis" :key="val.name" @click="checkContract(val.name, val, 'Call', index)">
            {{ ellipsisFunction(val.name) }}</div>
        </div>
      </div>

    </div>
    <div class="col-span-2 p-[32px]">
      <div>
        <ContractForm :checkValue="checkValue" :subTitle="subTitle" :contractAddress="contractAddress" :inputs="inputs" :outputs="outputs" :abiInfo="abiInfo"
                      :network="network"
          :frameType="frameType" :buttonInfo="buttonInfo" :payable="payable" ref="contractForm" :aptosName="aptosName" :aptosAddress="aptosAddress" :canisterId="canisterId">
        </ContractForm>
      </div>
      <!-- <div v-if="!checkValue">noData</div> -->
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, reactive, toRefs, onMounted } from "vue";
import YAML from "yaml";
import ContractForm from "./ContractForm.vue";
import { useThemeStore } from "@/stores/useTheme";
import { toICPService, toDisplay } from "@/utils/contractICPMove";
const theme = useThemeStore();

const props = defineProps({
  contractAddress: String,
  abiInfo: String,
  network:String,
  frameType: Number,
  canisterId: String,
});

const { contractAddress, abiInfo, frameType,network } = toRefs(props);

const sendAbis = reactive<any>([])
const callAbis = reactive<any>([])
const buttonInfo = ref('');
const checkValue = ref('');
const subTitle = ref('');
const checkValueIndex = ref(0);
const inputs = ref([]);
const outputs = ref([]);
const contractForm = ref();
const abiInfoData = reactive([]);
const aptosName = ref('')
const aptosAddress = ref('')
const payable = ref(false)



const data = YAML.parse(abiInfo.value);
console.log("abiInfo::::", data);
if (data.abi) {
  Object.assign(abiInfoData, data.abi)
} else {
  Object.assign(abiInfoData, data)
}

const commonFirst = () => {
  if (sendAbis.length > 0) {
    checkValue.value = sendAbis[0]?.name;
    // aptos send abi需单独处理
    if (frameType?.value == 2) {
      inputs.value = sendAbis[0]?.params?.filter((item: any) => {
        return item != "&signer"
      }).map((enmu: any, index: number) => {
        return {
          name: `param${index + 1}`,
          internalType: enmu
        }
      })
    }else if(frameType?.value==8){
      inputs.value = sendAbis[0]?.args;
    }else{
      inputs.value = sendAbis[0]?.inputs;
      outputs.value = sendAbis[0]?.outputs
      payable.value = sendAbis[0]?.stateMutability === 'payable'
    }
    buttonInfo.value = 'Transact'
  } else if (sendAbis.length <= 0 && callAbis.length > 0) {
    checkValue.value = callAbis[0]?.name;
    // aptos call abi
    if (frameType?.value == 2) {
      // inputs.value = callAbis[0]?.fields;
    } else {
      inputs.value = callAbis[0]?.inputs;
      outputs.value = callAbis[0]?.outputs;
      payable.value = callAbis[0]?.stateMutability === 'payable' || callAbis[0]?.stateMutability === 'pure'
    }
    buttonInfo.value = 'Call'
  } else {
    checkValue.value = ''
  }
}

const emit = defineEmits(["checkContract"])

const ellipsisFunction = (column: string) => {
  if (!column) {
    return ""
  }
  if (column.length > 26) {
    return column.slice(0, 23) + '...'
  }
  return column
}

const checkContract = async (name: string, val: any, text: string, index: number) => {
  contractForm.value.submitErrorInfo = "";
  inputs.value = []
  outputs.value = []
  console.log('checkContract', val)
  checkValueIndex.value = index;
  // console.log(buttonInfo, 'buttonInfo')
  if (frameType?.value == 7) {
    const argString = await toDisplay(val)
    checkValue.value = name + "：" + argString;
    subTitle.value = val.description;
  } else {
    checkValue.value = name
  }
  // 如果是aptos需要单独处理
  if (frameType?.value === 2) {
    if (val?.abilities) {
      // aptos call
      // inputs.value = val.fields.map((item:any)=>{
      //   return {
      //     name:item.name,
      //     internalType:item.type
      //   }
      // })
    } else {
      // aptos send
      inputs.value = val.params.filter((item: any) => {
        return item != "&signer"
      }).map((enmu: any, index: number) => {
        return {
          name: `param${index + 1}`,
          internalType: enmu
        }
      })
    }
  } else {
    inputs.value = val.inputs || val.args
    outputs.value = val.outputs
    payable.value = val.stateMutability === 'payable'
  }
  buttonInfo.value = text
  console.log("payable: ", payable.value)

  emit("checkContract", inputs, name);
  emit("checkContract", outputs, name);
}

const getContractICPMoveInfo = async (abi: any) => {
  // 把 abi 转成可用数组
  const temArr: any = await toICPService(abi)
  // 取出数组中的 methods 用于遍历出 send call
  const methodsArr = temArr.map((item: any) => {
    return item.methods
  })?.flat()

  methodsArr.map((it: any) => {
    if (it.type == 'send') {
      sendAbis.push(it)
    } else if (it.type == 'call') {
      callAbis.push(it)
    }
  })
  console.log('getContractICPMoveInfo:', methodsArr)
  console.log('sendAbis,callAbis:', sendAbis, callAbis)
  if (sendAbis.length > 0) {
    inputs.value = sendAbis[0].args;
    subTitle.value = sendAbis[0].description
    const argString = await toDisplay(sendAbis[0])
    checkValue.value = sendAbis[0]?.name + "：" + argString;
    buttonInfo.value = 'Transact'
  } else if (sendAbis.length <= 0 && callAbis.length > 0) {
    inputs.value = callAbis[0].args;
    subTitle.value = callAbis[0].description
    const argString = await toDisplay(callAbis[0])
    checkValue.value = callAbis[0]?.name + "：" + argString;
    buttonInfo.value = 'Call'
  } else {
    checkValue.value = ''
  }
}

onMounted(() => {
  // debugger send call
  // console.log(111111111111111,contractAddress?.value, abiInfo?.value, frameType?.value)
  if (frameType?.value && frameType?.value == 2) {
    Object.assign(sendAbis, data.exposed_functions)
    // Object.assign(callAbis, data.structs)
    console.log('sendAbis,callAbis', sendAbis, callAbis)
    aptosName.value = data.name
    aptosAddress.value = data.address
    commonFirst()
  } else if (frameType?.value == 7) {
    getContractICPMoveInfo(JSON.parse(abiInfo?.value))
  }else if(frameType?.value == 8){
    let arr = JSON.parse(abiInfo?.value!);
    arr.instructions.map((item:any)=>{
      sendAbis.push(item)
    })
    commonFirst()
  } else {
    console.log('000000000000000')
    abiInfoData.map((item: any) => {
      console.log(item)
      if (item.type === "function") {
        if (!item.stateMutability || item.stateMutability === 'nonpayable' || item.stateMutability === 'payable') {
          sendAbis.push(item)
        } else if (item.stateMutability === 'view' || item.stateMutability === 'constant' || item.stateMutability === 'pure') {
          callAbis.push(item)
        }
      }
      commonFirst()
    })
  }
})

</script>
<style lang='less' scoped>
@baseColor: #E2B578;

.contractList {
  font-size: 14px;

  .contractList-left {
    border-right: 1px solid #EBEBEB;
  }
}

.btn {
  width: 131px;
  height: 43px;
}

html[data-theme='dark'] {
  .checked {
    background-color: rgba(226, 181, 120, 0.2);
  }

  .contractList-left {
    border-right: 1px solid #434343;
  }
}

.checked {
  background-color: rgba(226, 181, 120, 0.2);
}
</style>
