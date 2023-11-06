<template>
  <div>
    <a-modal :footer="null" width="760px" centered="true" v-model:visible="visibleNumber">
      <div class="text-[24px] text-[#151210] font-bold">Sign Using Wallet</div>
      <template #closeIcon>
        <img class="mt-5" src="@/assets/icons/closeIcon.svg" @click="close" />
      </template>
      <div class="text-center">
        <img class="w-[80px]" src="@/assets/images/Transactions.png" />
        <div class="text-[21px] font-bold text-[#151210]">
          <label>This acion will trigger </label>
          <label class="text-[#E2B578] text-[30px] "> {{number}} </label>
          <label> transactions.</label>
        </div>
        <div class="text-[21px] text-[#73706E]">Your wallet will prompt to sign these transactions.</div>
        <div class="mt-[32px]">
          <a-button class="cancel-btn" @click="close">Cancel</a-button>
          <a-button :disabled="!number" class="next-btn" @click="clickNext">Next</a-button>
        </div>
      </div>

    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from "vue";
const props = defineProps({
  number:{
    type:Number,
    default:0
  },
  visibleNumber:{
    type:Boolean,
    default:false
  }
})
const { number,visibleNumber } = toRefs(props)
const emit = defineEmits(["closeDeployContractsNumberModal","goDeploy"])

const close = ()=>{
  emit('closeDeployContractsNumberModal')
}

const clickNext = () => {
  console.log('点击了next')
  emit('goDeploy')
}

</script>

<style lang="less" scoped>
.ant-btn {
  height: 43px;
  width: 24%;
}

.cancel-btn {
  background-color: #ffffff;
  color: #E2B578;
  margin-right: 20px;
}
</style>