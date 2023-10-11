<template>
  <div>
    <bread-crumb :routes="breadCrumbInfo" />
    <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
      <div class="text-[28px] font-bold mb-[10px]">Deployment Orchestration</div>
      <div class="text-[16px] text-[#E0DBD2]">Automate multi-contract deployment through presetvdeployment sequence and
        logic</div>
      <div class="h-[1px] my-[32px] border border-solid dark:border-[#434343] border-[#EBEBEB]"></div>
    </div>
    <div class="grid grid-cols-2 gap-8">
      <div>
        <DeploymentOrder @selectContractId="selectContractId"></DeploymentOrder>
      </div>

      <div>
        <ContractParams :selectedId="selectedId"></ContractParams>
        <InvokeContract></InvokeContract>
        <div>
          <div class="flex justify-between mt-[30px]">
            <div class="text-[24px] font-bold">Proxy Contract</div>
            <a-switch v-model:checked="checked" @change="changeChecked" />
          </div>

          <div class="mb-[20px] text-[16px] text-[#E0DBD2]">Automatically call contract methods post-deployment,
            including its
            own init method or other contracts' methods</div>
        </div>
      </div>
    </div>

    <div class="h-[1px] my-[32px] border border-solid dark:border-[#434343] border-[#EBEBEB]"></div>
    <div class="text-right">
      <a-button class="delete-btn w-[143px] mr-[20px] ">Delete</a-button>
      <a-button class="w-[143px]">Save</a-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import BreadCrumb from "@/components/BreadCrumb.vue";
import DeploymentOrder from "../projectsDeploymentOrchestration/components/DeploymentOrder.vue";
import ContractParams from '../projectsDeploymentOrchestration/components/ContractParams.vue';
import InvokeContract from '../projectsDeploymentOrchestration/components/InvokeContract.vue';
const breadCrumbInfo = ref([]);
const selectedId = ref('');


const selectContractId = (id: string) => {
  selectedId.value = id;
  console.log(id + 'id')
}

</script>

<style lang="less" scoped>
.ant-btn {
  height: 43px;

}

.delete-btn {}
</style>