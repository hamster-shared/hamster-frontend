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
        <div>
          <DeploymentOrder @selectContractId="selectContractId"></DeploymentOrder>
        </div>
        <!-- right -->
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
      <!-- line -->
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
            <a-button @click="deployManyContract">Deploy Now</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <UsingWalltModal /> -->
  <!-- <CustomParamsmodal /> -->
  <!-- <DeploymentOrchestrationmodal /> -->
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useThemeStore } from "@/stores/useTheme";
import BreadCrumb from "@/components/BreadCrumb.vue";
import DeployVersionInfomation from '@/components/DeployVersionInfomation.vue';
import ContractParams from './components/ContractParams.vue';
import InvokeContract from './components/InvokeContract.vue';
import UsingWalltModal from "./components/UsingWalltModal.vue";
import CustomParamsmodal from "./components/CustomParamsmodal.vue";
import DeploymentOrchestrationmodal from "./components/DeploymentOrchestrationmodal.vue";
import DeploymentOrder from "./components/DeploymentOrder.vue";
import { apiGetProjectsDetail } from '@/apis/projects'
const theme = useThemeStore();
const value1 = ref<string>('1');
const checked = ref<boolean>(false);
const breadCrumbInfo = ref<any>([]);
const versionList = ref(["1", "2", "3"]);
const selectedId = ref('');
const route = useRoute()
const router = useRouter()
// 合约信息对象
const contractInfo = ref<any>()


const changeChecked = (val: any) => {
  console.log(val, 'switch')
}

const changeContractVersion = (val: any) => {
  console.log(val, 'version')
}

// 导航栏
const initBreadCrumb = ()=>{
  breadCrumbInfo.value = [
    {
      breadcrumbName: 'Projects',
      path: '/projects'
    },
    {
      breadcrumbName: contractInfo.value.name,
      path: `/projects/${contractInfo.value.id}/details/${contractInfo.value.type}`
    },
    {
      breadcrumbName: 'Deploy',
      path: ''
    },
  ]
}

const selectContractId = (id: string) => {
  selectedId.value = id;
  console.log(id + 'id')
}

// 获取合约详情
const getContactDetail = async()=>{
  const res = await apiGetProjectsDetail(route.query.id)
  if(res.code===200){
    contractInfo.value = res.data
    console.log('获取合约详情:',res)
  }
}

const deployManyContract = async()=>{
  // 部署调用代码

  router.push(`/projects/projectsDeploymentDetail?id=${contractInfo.value.id}`)
}

onMounted(async () => {
  await getContactDetail()
  initBreadCrumb()
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

.ant-switch {
  background-color: #f0f0f0;

  &.ant-switch-checked {
    background-color: #E2B578;

    &:hover {
      box-shadow: 0 0 0 2px #E2B578;
    }

    &:focus {
      box-shadow: 0 0 0 2px #E2B578;
    }
  }

}
</style>#E2B578