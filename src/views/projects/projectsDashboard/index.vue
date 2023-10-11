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
              <img @click="copyToClipboard(record.contractAddress)" src="@/assets/icons/copy.svg"
                class="h-[19px] cursor-pointer ml-[8px]" />
            </div>
          </template>

          <template v-if="column.key === 'action'">
            <a-button type="link" @click="goExplorer(record.id)">Explorer</a-button>
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
const theme = useThemeStore();
const breadCrumbInfo = ref<any>([]);
const versionvValue = ref('1')
const versionList = ref(['1', '2', '3']);
const route = useRoute()
const router = useRouter()
// 合约信息对象
const contractInfo = ref<any>()


const changeContractVersion = (val: any) => {
  console.log('当前版本：' + val)
}


const columns = ref([{
  title: 'Contract',
  dataIndex: 'contract',
  key: 'contract',
},
{
  title: 'Version',
  dataIndex: 'version',
  key: 'version',
},
{
  title: 'Network',
  dataIndex: 'network',
  key: 'network',
},
{
  title: 'Contract Address',
  dataIndex: 'contractAddressMinData',
  key: 'contractAddressMinData',
},
{
  title: 'Timestamp',
  dataIndex: 'timestamp',
  key: 'timestamp',
},
{
  title: 'Action',
  dataIndex: 'action',
  key: 'action',
},])


const dataSource = ref([{
  contract: 'Contract A',
  version: '#1',
  network: 'Ethereum/Goerli',
  contractAddress: '0x5Baf67hgs88990stbnjs8ja3400',
  timestamp: '嘻嘻',
},
{
  contract: 'Contract B',
  version: '#1',
  network: 'Ethereum/Goerli',
  contractAddress: '0x5Baf67hgs88990stbnjs8ja0',
  timestamp: '嘻嘻',
},])


const splitDataSource = () => {
  dataSource.value.map((item: any) => {
    if (item.contractAddress) {
      item.contractAddressMinData = item.contractAddress.substring(0, 6) + "..." + item.contractAddress.substring(item.contractAddress.length - 4)
    }
  })
}


const goExplorer = (id: string) => {
  console.log(id)
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
      breadcrumbName: 'projectsDashboard',
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

onMounted(async () => {
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