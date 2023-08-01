<template>
  <a-modal v-model:visible="props.visible" width="900px" :footer="null" @cancel="handleCancel">
    <template #closeIcon>
        <!-- <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/> -->
    </template>
    <div class="p-[8px]">
      <div class="flex justify-between items-center">
        <div class="w-[55%]">
          <div class="text-[24px] font-bold leading-[33px]">Buy Cycles</div>
        </div>
        <div>
          <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/>
        </div>
      </div>
      <div class="mt-[40px]">
        <a-steps :current="currStep">
          <a-step title="Send ICP Tokens" />
          <a-step title="Convert ICP Tokens to Cycles" />
          <a-step title="verify wallet canister" />
        </a-steps>
        <div class="mt-[20px]">
          <div v-if="currStep === 0">
            <div class="text-[#A4A5A8]">Get the account identifier for your developer identity. Then, you can copy  your account number to send some ICP Tokens. When finished, click “Next” button.</div>
            <div class="p-[20px] mt-[20px] bg-[#FFF9F2] rounded-[5px] flex justify-between">
              <div>
                <span class="text-[#73706E] font-medium">Account-ID:</span>
                <span class="ml-[10px]">e213184a548871a47fb526f3cba24e2ee2fbbc8129c4ab497ef2ce535130a0a4</span>
              </div>
              <img @click="copyToClipboard('')" src="@/assets/icons/copy.svg" class="h-[19px] ml-[10px] cursor-pointer" />
            </div>
            <div class="p-[20px] mt-[20px] bg-[#FFEEE8] rounded-[5px] flex">
              <img src="@/assets/images/Fail-2.png" class="h-[24px] mr-[20px]"/>
              <div>All ICP tokens deposited will be used to purchase cycle products. Please plan your capital allocation prudently.</div>
            </div>
          </div>
          <div v-else-if="currStep === 1">
            <div class="text-[#A4A5A8]">Check your account balance.Then, click ”Next” button to convert those ICP tokens to cycles and move them into a cycles wallet.</div>
            <div class="p-[20px] mt-[20px] bg-[#FFF9F2] rounded-[5px] flex">
              <div class="text-[#73706E] font-medium">
                <div>Account-ID:</div>
                <div class="mt-[10px]">Balance(ic):</div>
              </div>
              <div class="ml-[10px]">
                <div>e213184a548871a47fb526f3cba24e2ee2fbbc8129c4ab497ef2ce535130a0a4</div>
                <div class="mt-[10px]">10.0000000 ICP</div>
              </div>
            </div>
          </div>
          <div v-else-if="currStep === 2">
            <div class="text-[#A4A5A8]">Check your account balance.Then, you can convert those ICP tokens to cycles and move them into a cycles wallet.</div>
            <div class="p-[20px] mt-[20px] bg-[#FFF9F2] rounded-[5px] flex">
              <div class="text-[#73706E] font-medium">
                <div>Wallet Canister: </div>
                <div class="mt-[10px]">Balance:</div>
              </div>
              <div class="ml-[10px]">
                <div>r3dpl-2yaaa-aaaam-abpsa-cai</div>
                <div class="mt-[10px]">100.00 T Cycles</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-[32px]" :class="[currStep === 2 ? 'text-center' : currStep > 0 ? 'flex justify-between' : 'text-right']">
        <a-button v-if="currStep === 1" class="!w-[240px] !h-[43px]" ghost @click="handleLast">Previous</a-button>
        <a-button v-if="currStep < 2" class="!w-[240px] !h-[43px]" @click="handleNext">Next</a-button>
        <a-button v-if="currStep == 2" class="!w-[240px] !h-[43px]" @click="handleDone">Done</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { copyToClipboard } from "@/utils/tool";


const props = defineProps({
  visible:{
      type:Boolean,
      default:false
  }
});
const emit = defineEmits(["handleCancel"])
const currStep = ref(0);
const handleLast = () => {
  currStep.value--;
}
const handleNext = () => {
  currStep.value++;
}
const handleDone = () => {
  currStep.value = 0;
  emit('handleCancel')
}
const handleCancel = () => {
  currStep.value = 0;
  emit('handleCancel')
}
</script>
<style scoped lang="less">
:deep(.ant-form-item-label>label){
  width: 100%;
}
:deep(.ant-form-item){
  margin-bottom: 0px;
}
:deep(.ant-radio-wrapper-checked span){
  color: #151210;
}
:deep(.ant-radio-wrapper){
  color: #73706E;
}
</style>