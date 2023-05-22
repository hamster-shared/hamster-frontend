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
            :class="(checkValue === val.name && checkValueIndex === index) ? 'checked' : ''"
            v-for="(val, index) in sendAbis" :key="val.name" @click="checkContract(val.name, val, 'Transact', index)">
            {{ val.name }}</div>
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
            :class="(checkValue === val.name && checkValueIndex === index) ? 'checked' : ''"
            v-for="(val, index) in callAbis" :key="val.name" @click="checkContract(val.name, val, 'Call', index)">
            {{ val.name }}</div>
        </div>
      </div>

    </div>
    <div class="col-span-2 p-[32px]">
      <div>
        <ContractForm :checkValue="checkValue" :contractAddress="contractAddress" :inputs="inputs" :outputs="outputs" :abiInfo="abiInfo"
          :frameType="frameType" :buttonInfo="buttonInfo" ref="contractForm" :aptosName="aptosName" :aptosAddress="aptosAddress">
        </ContractForm>
      </div>
      <!-- <div v-if="!checkValue">noData</div> -->
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, reactive, toRefs } from "vue";
import YAML from "yaml";
import ContractForm from "./ContractForm.vue";
import { useThemeStore } from "@/stores/useTheme";
import { nextTick } from "process";
const theme = useThemeStore();

const props = defineProps({
  contractAddress: String,
  abiInfo: String,
  frameType: Number,
});

const { contractAddress, abiInfo, frameType } = toRefs(props);

const sendAbis = reactive<any>([])
const callAbis = reactive<any>([])
const buttonInfo = ref('');
const checkValue = ref('');
const checkValueIndex = ref(0);
const inputs = ref([]);
const outputs = ref([]);
const contractForm = ref();
const abiInfoData = reactive([]);
const aptosName = ref('')
const aptosAddress = ref('')

const data = YAML.parse(abiInfo.value);
if (data.abi) {
  Object.assign(abiInfoData, data.abi)
} else {
  Object.assign(abiInfoData, data)
}
nextTick(()=>{
  // debugger send call
  if(frameType?.value && frameType?.value==2){
    Object.assign(sendAbis, data.exposed_functions)
    Object.assign(callAbis, data.structs)
    console.log('sendAbis,callAbis',sendAbis,callAbis)
    aptosName.value = data.name
    aptosAddress.value = data.address
    commonFirst()
  }else{
    console.log('others~~~~~~~')
    abiInfoData.map((item: any) => {
      if (item.type === "function") {
        if (!item.stateMutability || item.stateMutability === 'nonpayable' || item.stateMutability === 'payable') {
          sendAbis.push(item)
        } else if (item.stateMutability === 'view' || item.stateMutability === 'constant') {
          callAbis.push(item)
        }
      }
      commonFirst()
    })
  }
})
const commonFirst = ()=>{
  if (sendAbis.length > 0) {
    checkValue.value = sendAbis[0]?.name;
    // aptos send abi需单独处理
    if(frameType?.value==2){
      inputs.value = sendAbis[0]?.params?.filter((item:any)=>{
        return item != "&signer"
      }).map((enmu:any,index:number)=>{
        return {
          name:`param${index+1}`,
          internalType:enmu
        }
      })
    }else{
      inputs.value = sendAbis[0]?.inputs;
      outputs.value = sendAbis[0]?.outputs
    }
    buttonInfo.value = 'Transact'
  } else if (sendAbis.length <= 0 && callAbis.length > 0) {
    checkValue.value = callAbis[0]?.name;
    // aptos call abi
    if(frameType?.value==2){
      // inputs.value = callAbis[0]?.fields;
    }else{
      inputs.value = callAbis[0]?.inputs;
      outputs.value = callAbis[0]?.outputs;
    }
    buttonInfo.value = 'Call'
  } else {
    checkValue.value = ''
  }
}

const emit = defineEmits(["checkContract"])

const checkContract = (name: string, val: any, text: string, index: number) => {
  inputs.value = []
  outputs.value = []
  console.log('checkContract',val)
  checkValueIndex.value = index;
  // console.log(buttonInfo, 'buttonInfo')
  checkValue.value = name
  // 如果是aptos需要单独处理
  if(frameType?.value ===2){
    if(val?.abilities){
      // aptos call
      // inputs.value = val.fields.map((item:any)=>{
      //   return {
      //     name:item.name,
      //     internalType:item.type
      //   }
      // })
    }else{
      // aptos send
      inputs.value = val.params.filter((item:any)=>{
        return item != "&signer"
      }).map((enmu:any,index:number)=>{
        return {
          name:`param${index+1}`,
          internalType:enmu
        }
      })
    }
  }else{
    inputs.value = val.inputs
    outputs.value = val.outputs
  }
  buttonInfo.value = text

  emit("checkContract", inputs, name);
  emit("checkContract", outputs, name);
}

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
    background-color: #36322D;
  }

  .contractList-left {
    border-right: 1px solid #434343;
  }
}

.checked {
  background-color: #F9F9F9;
}
</style>