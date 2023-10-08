<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <bread-crumb :routes="breadCrumbInfo" />
    <DeployVersionInfomation />
    <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
      <div class="text-[28px] font-bold mb-[10px]">Deployment Orchestration</div>
      <div class="text-[16px] text-[#E0DBD2]">Automate multi-contract deployment through presetvdeployment sequence and
        logic</div>
      <!-- line -->
      <div class="h-[1px] my-[32px] border border-solid dark:border-[#434343] border-[#EBEBEB]"></div>
      <div class="grid grid-cols-2 gap-8">
        <!-- left -->
        <div>left</div>
        <!-- <div>
          <div class="text-[16px] font-bold">Deployment Order</div>
          <div class="text-[#E0DBD2] text-[16px] mb-[20px]">The deployment order can be freely set by dragging the
            concant
            cards up
            and down. The
            just confirm to quickly
            start the deploymnet, whic is convenient and fast.</div>
          <div>
            <div class="mb-[10px]">
              <a-input></a-input>
            </div>
            <div class="mb-[10px]">
              <a-input></a-input>
            </div>
            <div class="mb-[10px]">
              <a-input></a-input>
            </div>

          </div>
          <div class="h-[1px] my-[32px] border border-solid dark:border-[#434343] border-[#EBEBEB]"></div>
          <div class="text-[24px] font-bold mb-[20px]">
            Skipped Contract Deployment
          </div>
          <div class="mb-[10px]">
            <a-input></a-input>
          </div>

        </div> -->
        <!-- right -->
        <div>
          <div>
            <div class="text-[24px] font-bold">Contract Parameters</div>
            <div class="mb-[20px] text-[16px] text-[#E0DBD2]">Parameters the contract specifies to be passed in during
              deploymrnt
            </div>

            <div
              class="h-[90px] leading-[90px] text-center border border-solid rounded-[12px] border-[#302D2D] bg-[#191816] text-[14px] text-[#666666] ">
              No Data
            </div>
          </div>
          <div class="mt-[30px]">
            <div class="text-[24px] font-bold">Invoke Contract Method</div>
            <div class="mb-[20px] text-[16px] text-[#E0DBD2]">Automatically call contract methods post-deployment,
              including
              its
              own init method or other contracts' methods
            </div>
            <div
              class="h-[60px] leading-[60px] text-[16px] text-[#C3C4C7] text-center border border-dashed rounded-[12px] border-[#6C6C6C] bg-[#191816]">
              <img>
              <label>Add More Contract Methods</label>
            </div>

          </div>



          <!-- <ContractParameters />
          <invoke-contract-method /> -->
          <!-- Proxy Contract -->
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
      <div>
        <div class="text-[24px] font-bold">Network / Chain</div>
        <div class="mt-[10px] mb-[20px]">Select a network to deploy this contract on. We recommend starting with a
          testent
        </div>
        <div class="flex justify-between">
          <a-select ref="select" v-model:value="value1" style="width: 50%" @change="changeContractVersion"
            :options="versionList.map(item => ({ value: item }))">
          </a-select>
          <div>
            <a-button>Connect Wallet</a-button>
            <a-button>Deploy Now</a-button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { useThemeStore } from "@/stores/useTheme";
import BreadCrumb from "@/components/BreadCrumb.vue";
import DeployVersionInfomation from '@/components/DeployVersionInfomation.vue';
import ContractParameters from "./components/ContractParameters.vue";
import InvokeContractMethod from "./components/InvokeContractMethod.vue";
const theme = useThemeStore();
const value1 = ref<string>('1');
const checked = ref<boolean>(false);
const breadCrumbInfo = ref<any>([]);
const versionList = ref(["1", "2", "3"]);


const changeChecked = (val: any) => {
  console.log(val, 'switch')
}

const changeContractVersion = (val: any) => {
  console.log(val, 'version')
}

onMounted(async () => {
  // 导航栏
  breadCrumbInfo.value = [
    {
      breadcrumbName: 'Projects',
      path: '/projects'
    },
    {
      breadcrumbName: 'projectsDeploymentOrchestration',
      path: ''
    },
  ]
})

</script>

<style lang='less' scoped>
.ant-btn {
  height: 43px;

  &:first-child {
    margin-right: 24px;
  }
}

.ant-switch {
  margin-top: 8px;
}

//  ant-switch

// .ant-switch {
//   background-color: rgba(0, 0, 0, .1) !important;
// }
</style>