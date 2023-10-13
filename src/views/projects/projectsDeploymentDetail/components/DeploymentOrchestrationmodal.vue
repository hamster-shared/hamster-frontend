<template>
  <div>
    <a-modal :footer="null" width="760px" centered="true" v-model:visible="importVisible">
      <div class="text-[24px] text-[#151210] font-bold mb-[32px]">Deployment Orchestration</div>
      <template #closeIcon>
        <img class="mt-5" src="@/assets/icons/closeIcon.svg" />
      </template>
      <div v-for="(item, index) in list" :key="item.name">
        <div>
          <span class="text-[14px] font-bold text-[#ffffff] bg-[#E2B578] py-[2px] px-[7px] rounded-[4px] mr-[20px]">{{
            index +
            1 }}</span>
          <span class="text-[18px] font-bold text-[#151210]"> {{ item.name }}</span>
        </div>
        <div v-if="item.contractParameters" class="flex mb-[20px]">
          <div class="mr-[20px] leading-[42px]">Contract Parameters: </div>
          <div class="flex border border-solid border-[#EBEBEB] bg-[#F6F6F6] px-[15px] py-[10px] rounded-[8px]">
            <div v-for="it in item.contractParameters" :key="it" class="">
              <div class="inline-block">{{ it + ',' }}</div>
            </div>
          </div>

        </div>
        <div v-if="item.invokeContractMethod" class="flex mb-[20px]">
          <div class="mr-[20px] leading-[42px]">Invoke Contract Method: </div>
          <div class="flex border border-solid border-[#EBEBEB] bg-[#F6F6F6] px-[15px] py-[10px] rounded-[8px]">
            <div v-for="it in item.invokeContractMethod" :key="it" class="">
              <div class="inline-block">{{ it + ',' }}</div>
            </div>
          </div>

        </div>
        <div v-if="item.proxyContractRequired" class="flex mb-[20px]">
          <div class="mr-[20px] leading-[42px]">Proxy Contract Required: </div>
          <div class="flex border border-solid border-[#EBEBEB] bg-[#F6F6F6] px-[15px] py-[10px] rounded-[8px]">
            Yes
          </div>

        </div>

      </div>
      <div v-if="skippedContractDeploymentList.length > 0">
        <div class="h-[1px] border border-solid border-[#EBEBEB] mb-[20px]"></div>
        <div class="text-[21px] text-[#151210] font-bold mb-[20px]">Skipped Contract Deployment</div>
        <div v-for="item in skippedContractDeploymentList" :key="item" class="mb-[20px]">
          <span
            class="inline-block w-[20px] h-[20px] align-middle text-[14px] font-bold text-[#ffffff] bg-[#E2B578] opacity-30 py-[2px] px-[6px] rounded-[4px] mr-[20px]"></span>
          <span class="text-[16px] text-[#151210] font-bold ">{{ item }}</span>
        </div>
      </div>
      <div class="text-center">
        <a-button @click="importVisible = false">Close</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const importVisible = ref<boolean>(true);

const list = ref([{ name: "Contract A", contractParameters: ['params1', 'params2', 'params3'] },
{ name: "Contract B", contractParameters: ['params1', 'params2', 'params3'], proxyContractRequired: true },
{ name: "Contract C", contractParameters: ['params1', 'params2', 'params3'], invokeContractMethod: ['0', '9'] }]);

const skippedContractDeploymentList = ref(['Contract D', 'Contract E'])

console.log(skippedContractDeploymentList.value.length, 'ppp')

</script>

<style lang="less" scoped>
.ant-btn {
  height: 43px;
  width: 240px;
}
</style>