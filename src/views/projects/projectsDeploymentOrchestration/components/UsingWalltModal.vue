<template>
  <div>
    <a-modal :footer="null" width="760px" centered="true" v-model:visible="importVisible">
      <div class="text-[24px] text-[#151210] font-bold">Sign Using Wallet</div>
      <template #closeIcon>
        <img class="mt-5" src="@/assets/icons/closeIcon.svg" @click="importVisible = false" />
      </template>
      <div class="text-center">
        <img class="w-[80px]" src="@/assets/images/Transactions.png" />
        <div class="text-[21px] font-bold text-[#151210]">
          <label>This acion will trigger </label>
          <label class="text-[#E2B578] text-[30px] "> 5 </label>
          <label> transactions.</label>
        </div>
        <div class="text-[21px] text-[#73706E]">Your wallet will prompt to sign these transactions.</div>
        <div class="mt-[32px]">
          <a-button class="cancel-btn" @click="importVisible = false">Cancel</a-button>
          <a-button class="next-btn" @click="clickNext">Next</a-button>
        </div>
      </div>

    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const importVisible = ref<boolean>(true);

const clickNext = () => {
  console.log('点击了next')
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