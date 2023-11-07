<template>
  <div>
    <a-modal :footer="null" width="760px" centered="true" v-model:visible="showVisible">
      <div class="text-[24px] text-[#151210] font-bold mb-[32px]">Deployment Orchestration</div>
      <template #closeIcon>
        <img class="mt-5" src="@/assets/icons/closeIcon.svg" @click="hideVisible" />
      </template>
      <div v-if="orchestrationInfo.useContract.length" v-for="(item, index) in orchestrationInfo.useContract" :key="index">
        <div class="flex items-center">
          <span class="text-[14px] font-bold text-[#ffffff] bg-[#E2B578] py-[2px] px-[7px] rounded-[4px] mr-[20px]">
            {{ index + 1 }}
          </span>
          <span class="text-[18px] font-bold text-[#151210]"> {{ item.name }}</span>
        </div>
        <div v-if="!item.originalArrange" class="mb-[20px] leading-[42px]">
          no setting
        </div>
        <div v-else v-for="(itemArr , indexArr) in JSON.parse(item.originalArrange).deployStep" :key="indexArr">
          <div v-for="(itemStep , indexStep) in itemArr.steps" :key="indexStep">
            <div v-if="indexStep == 0" class="flex mb-[20px]">
              <div class="mr-[20px] leading-[42px] w-[160px]">Contract Parameters: </div>
              <div class="flex border border-solid border-[#EBEBEB] bg-[#F6F6F6] px-[15px] py-[10px] rounded-[8px]">
                {{ itemStep.params.join(', ') || 'no setting' }} 
              </div>
            </div>
            <div v-else class="flex mb-[20px]">
              <div class="mr-[20px] leading-[42px] w-[160px]">
                <label v-if="indexStep == 1">Invoke Contract Method: </label>
              </div>
              <div class="border border-solid border-[#EBEBEB] bg-[#F6F6F6] px-[15px] py-[10px] rounded-[8px] max-w-[530px] break-all">
                {{ itemStep.contractName + '.' + itemStep.method + '(' + itemStep.params.join(', ')+' '+itemStep.value + ')' }} 
              </div>
            </div>
          </div>
          <div v-if="itemArr.contract.proxy" class="flex mb-[20px]">
            <div class="mr-[20px] leading-[42px] w-[160px]">Proxy Contract Required: </div>
            <div class="flex border border-solid border-[#EBEBEB] bg-[#F6F6F6] px-[15px] py-[10px] rounded-[8px]">
              Yes
            </div>
          </div>
        </div>
      </div>
      <div v-if="orchestrationInfo.noUseContract.length">
        <div class="h-[1px] border border-solid border-[#EBEBEB] mb-[20px]"></div>
        <div class="text-[21px] text-[#151210] font-bold mb-[20px]">Skipped Contract Deployment</div>
        <div v-for="(item, index) in orchestrationInfo.noUseContract" :key="index" class="mb-[20px] flex items-center">
          <span
            class="inline-block w-[20px] h-[20px] align-middle text-[14px] font-bold text-[#ffffff] bg-[#E2B578] opacity-30 py-[2px] px-[6px] rounded-[4px] mr-[20px]"></span>
          <span class="text-[16px] text-[#151210] font-bold ">{{ item.name }}</span>
        </div>
      </div>
      <div class="text-center">
        <a-button @click="hideVisible">Close</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from "vue";

const props = defineProps({
  orchestrationInfo:{
    type:Object,
    default:''
  },
  showVisible:{
    type:Boolean,
    default:false
  }
})
const { orchestrationInfo,showVisible } = toRefs(props)
const emit = defineEmits(["hideVisible"])

const hideVisible = () => {
  emit('hideVisible');
}

onMounted(() => {
  console.log("orchestrationInfo.value:",orchestrationInfo.value);
});
</script>

<style lang="less" scoped>
.ant-btn {
  height: 43px;
  width: 240px;
}
</style>