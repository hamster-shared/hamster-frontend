<template>
  <div>
    <BreadCrumb :routes="breadCrumbInfo" />
    <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
      <a-select ref="select" v-model:value="versionvValue" style="width: 24%" @change="changeContractVersion"
        :options="versionList.map(item => ({ value: item }))">
      </a-select>
      <a-table :dataSource="dataSource" :columns="columns" :pagination="false">

        <template #bodyCell="{ column, record }">

          <template v-if="column.key === 'contractAddressMinData'">
            <div>
              <span>{{ record.contractAddressMinData }}</span>
              <img @click="copyToClipboard(record.address)" src="@/assets/icons/copy.svg"
                class="h-[19px] cursor-pointer ml-[8px]" />
            </div>
          </template>

          <template v-if="column.key === 'action'">
            <!-- 单个合约id -->
            <a-button type="link" @click="goExplorer(record.id, record.projectId)">Explorer</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { apiGetProjectsDetail } from '@/apis/projects'
import BreadCrumb from "@/components/BreadCrumb.vue";
import { useThemeStore } from "@/stores/useTheme";
import { copyToClipboard } from "@/utils/tool";
import { apiGetExecuteInfoList } from '@/apis/contractOrchestrationDeploy'
import { apiGetProjectsVersions } from "@/apis/workFlows";
const theme = useThemeStore();
const breadCrumbInfo = ref<any>([]);
const versionvValue = ref<string>('')
const versionList = ref<any>([]);
const route = useRoute()
const router = useRouter()
// 合约信息对象
const contractInfo = ref<any>()


const changeContractVersion = (val: any) => {
  console.log('当前版本：' + val)
  getList()
}


const columns = ref([{
  title: 'Contract',
  dataIndex: 'contractName',
  key: 'contractName',
},
{
  title: 'Version',
  dataIndex: 'version',
  key: 'version',
  customRender: ({ text }) => `#${text}`,
  align: 'center'
},
{
  title: 'Network',
  dataIndex: 'network',
  key: 'network',

},
{
  title: 'Contract Address',
  dataIndex: 'address',
  key: 'contractAddressMinData',
},
{
  title: 'Timestamp',
  dataIndex: 'deployTimeFormat',
  key: 'deployTimeFormat',
},
{
  title: 'Action',
  dataIndex: 'action',
  key: 'action',
  align: 'center'
}])


const dataSource = ref<any>([])


const splitDataSource = () => {
  dataSource.value?.map((item: any) => {
    if (item.address) {
      item.contractAddressMinData = item.address.substring(0, 6) + "..." + item.address.substring(item.address.length - 4)
    }
  })
}


const goExplorer = (id: string, projectId:string) => {
  console.log(id)
  router.push(`/projects/projectDashboardExplorer?id=${projectId}&contractDeployId=${id}`)
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
      breadcrumbName: 'Dashboard',
      path: ''
    },
  ]
}

// 获取合约详情
const getContactDetail = async()=>{
  const res = await apiGetProjectsDetail(route.query.id)
  if(res.code===200){
    contractInfo.value = res.data
    console.log('获取合约详情:',res)
  }
}

// 获取列表
const getList = async()=>{
  const res = await apiGetExecuteInfoList(route.query.id,versionvValue.value)
  try {
    dataSource.value = res.data
  } catch (error:any) {
    message.error(error)
  }
}

// 获取版本号
const getProjectsVersion = async () => {
  try {
    const { data } = await apiGetProjectsVersions({id: route.query.id});
    versionList.value = data
    versionvValue.value = versionList.value[0]
  } catch (error: any) {
    console.log("erro:", error)
  }
};

onMounted(async () => {
  await getProjectsVersion()
  await getList()
  splitDataSource();
  await getContactDetail()
  initBreadCrumb()
})
</script>

<style lang="less" scoped>
.ant-select {
  margin-bottom: 32px;
}
</style>