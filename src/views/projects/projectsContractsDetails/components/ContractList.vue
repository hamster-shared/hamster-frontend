<template>
  <div
    class="contractList dark:text-white text-[#121211] grid grid-cols-3 gap-4 border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px]">
    <div class="contractList-left p-[32px]">
      <div class="mb-[64px]" v-show="sendAbis.length > 0">
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
      <div v-show="callAbis.length > 0">
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
        <ContractForm :checkValue="checkValue" :contractAddress="contractAddress" :inputs="inputs" :abiInfo="abiInfo"
          :buttonInfo="buttonInfo" ref="contractForm">
        </ContractForm>
      </div>
      <!-- <div v-if="!checkValue">noData</div> -->
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, reactive, onMounted, toRefs } from "vue";
import YAML from "yaml";
import ContractForm from "./ContractForm.vue";
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore();

const props = defineProps({
  contractAddress: String,
  abiInfo: String,
});

const { contractAddress, abiInfo } = toRefs(props);

const sendAbis = reactive([])
const callAbis = reactive([])
const buttonInfo = ref('');
const checkValue = ref('');
const checkValueIndex = ref(0);
const inputs = ref([]);
const contractForm = ref();

const abiInfoData = YAML.parse(abiInfo.value)
// console.log(abiInfoData, 'abiInfoData')
abiInfoData.map((item: any) => {
  if (item.type === "function") {
    if (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable') {
      sendAbis.push(item)
    } else if (item.stateMutability === 'view' || item.stateMutability === 'constant') {
      callAbis.push(item)
    }
  }

  console.log(sendAbis, 'sendAbis')

  if (sendAbis.length > 0) {
    checkValue.value = sendAbis[0]?.name;
    inputs.value = sendAbis[0]?.inputs;
    buttonInfo.value = 'Transact'
  } else if (sendAbis.length <= 0 && callAbis.length > 0) {
    checkValue.value = callAbis[0]?.name;
    inputs.value = callAbis[0]?.inputs;
    buttonInfo.value = 'Call'
  } else {
    checkValue.value = ''
  }
})


const emit = defineEmits(["checkContract"])

const checkContract = (name: string, val: any, text: string, index: number) => {
  checkValueIndex.value = index;
  // console.log(buttonInfo, 'buttonInfo')
  checkValue.value = name
  inputs.value = val.inputs
  buttonInfo.value = text

  emit("checkContract", inputs, name);
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