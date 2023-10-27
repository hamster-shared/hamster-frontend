<template>
  <div>
    <bread-crumb :routes="breadCrumbInfo" />
    <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
      <div>
        <div class="text-[28px] font-bold mb-[10px]">Deployment Orchestration</div>
        <div class="text-[16px] text-[#73706E] dark:text-[#E0DBD2]">Automate multi-contract deployment through presetvdeployment sequence and
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

            <div class="mb-[20px] text-[16px] text-[#73706E] dark:text-[#E0DBD2]">Automatically call contract methods post-deployment,
              including its
              own init method or other contracts' methods</div>
          </div>
        </div>
      </div>

      <div class="h-[1px] my-[32px] border border-solid dark:border-[#434343] border-[#EBEBEB]"></div>
      <div class="text-right">
        <!-- 经产品确认没有删除 -->
        <!-- <a-button :class="theme.themeValue === 'dark' ? 'dark-btn' : 'white-btn'"
          class="delete-btn w-[143px] mr-[20px] bg-[#ffffff] dark:bg-[#1D1C1A]">Delete</a-button> -->
        <a-button class="w-[143px]" @click="goBack">Save</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BreadCrumb from "@/components/BreadCrumb.vue";
import { useThemeStore } from "@/stores/useTheme";
import DeploymentOrder from "@/views/projects/projectsDeploymentOrchestration/components/DeploymentOrder.vue";
import ContractParams from '@/views/projects/projectsDeploymentOrchestration/components/ContractParams.vue';
import InvokeContract from '@/views/projects/projectsDeploymentOrchestration/components/InvokeContract.vue';
import { apiGetProjectsDetail } from '@/apis/projects'
const theme = useThemeStore();
const breadCrumbInfo = ref<any>([]);
const selectedId = ref('');
const checked = ref(false)
const route = useRoute()
const router = useRouter()
// 合约信息对象
const contractInfo = ref<any>()


const selectContractId = (id: string) => {
  selectedId.value = id;
  console.log(id + 'id')
}

const goBack = ()=>{
  // 这一步还需具体确认
  router.back()
}

// 获取合约详情
const getContactDetail = async()=>{
  const res = await apiGetProjectsDetail(route.query.id)
  if(res.code===200){
    contractInfo.value = res.data
    console.log('获取合约详情:',res)
  }
}

const initBreadCrumb = ()=>{
  // 导航栏
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
      breadcrumbName: 'Deploy Setting',
      path: ''
    },
  ]
}

onMounted(async()=>{
  await getContactDetail()
  initBreadCrumb()
})

</script>

<style lang="less" scoped>
.ant-btn {
  height: 43px;
}

// rgba(226, 181, 120, 0.2)
.ant-btn:hover {
  background-color: rgba(226, 181, 120, 0.2)
}

.ant-btn:focus {
  background-color: rgba(226, 181, 120, 0.2)
}


.white-btn {
  background-color: #FFFFFF;
  color: #E2B578;
}


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
</style>