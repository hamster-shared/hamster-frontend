<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <bread-crumb :routes="breadCrumbInfo" />
    <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
      <div class="text-[24px] font-bold inline-block">hamster
        <div
          class="inline-block ml-4 text-[14px] rounded-[32px] py-1 px-4 border border-solid dark:border-[#434343] border-[#EBEBEB]">
          <label>EVM</label>
        </div>
      </div>
      <div class="mt-[32px] mb-[20px]">Contract Version</div>
      <a-space>
        <a-select ref="select" v-model:value="value1" style="width: 500px" @change="changeContractVersion"
          :options="versionList.map(item => ({ value: item }))">
        </a-select>
      </a-space>
      <div class="text-[16px] font-bold mt-[30px] mb-[20px]">Source Info</div>
      <div class="mb-[10px]">https://github.com/h</div>
      <div>
        3f433f6｜commit on No
      </div>

    </div>
    <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
      <div class="text-[28px] font-bold mb-[10px]">Deployment Orchestration</div>
      <div class="text-[16px] text-[#E0DBD2]">Automate multi-contract deployment through presetvdeployment sequence and
        logic</div>
      <!-- line -->
      <div class="h-[1px] my-[32px] border border-solid dark:border-[#434343] border-[#EBEBEB]"></div>
      <div class="grid grid-cols-2 gap-8">
        <!-- left -->
        <div>
          <div class="text-[16px] font-bold">Deployment Order</div>
          <div class="text-[#E0DBD2] text-[16px] mb-[20px]">The deployment order can be freely set by dragging the concant
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
          <!-- line -->
          <div class="h-[1px] my-[32px] border border-solid dark:border-[#434343] border-[#EBEBEB]"></div>
          <div class="text-[24px] font-bold mb-[20px]">
            Skipped Contract Deployment
          </div>
          <div class="mb-[10px]">
            <a-input></a-input>
          </div>

        </div>
        <!-- right -->
        <div>
          <ContractParameters />
          <invoke-contract-method />
          <!-- Proxy Contract -->
          <div>
            <div class="text-[24px] font-bold">Proxy Contract
              <a-switch v-model:checked="checked" @change="changeChecked" />
            </div>
            <div class="mb-[20px] text-[16px] text-[#E0DBD2]">Automatically call contract methods post-deployment,
              including its
              own init method or other contracts' methods</div>
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
import ContractParameters from "./components/ContractParameters.vue";
import InvokeContractMethod from "./components/InvokeContractMethod.vue";
const theme = useThemeStore();
const value1 = ref<string>('1');
const checked = ref<boolean>(false);
const breadCrumbInfo = ref<any>([]);
const versionList = ref(["1", "2", "3"]);


const changeChecked = (val) => {
  console.log(val, 'switch')
}

const changeContractVersion = (val) => {
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

<style lang='less' scoped></style>