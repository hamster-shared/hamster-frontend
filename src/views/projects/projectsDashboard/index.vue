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
              <img @click="copyInfo(record.contractAddress)" src="@/assets/icons/copy.svg"
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
import { message } from 'ant-design-vue';
import BreadCrumb from "@/components/BreadCrumb.vue";
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore();
const breadCrumbInfo = ref<any>([]);
const versionvValue = ref('1')
const versionList = ref(['1', '2', '3']);


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


const copyInfo = async (_items: any) => {
  let OrderNumber = _items;
  let newInput = document.createElement("input");
  newInput.value = OrderNumber;
  document.body.appendChild(newInput);
  newInput.select();
  try {
    await document.execCommand('Copy') // 执行浏览器复制命令
    newInput.remove();
    message.success("copy success");
  } catch {
    message.error("copy failed");
  }
}


const goExplorer = (id: string) => {
  console.log(id)
}


onMounted(async () => {
  splitDataSource();
  // 导航栏
  breadCrumbInfo.value = [
    {
      breadcrumbName: 'Projects',
      path: '/projects'
    },
    {
      breadcrumbName: 'projectsDashboard',
      path: ''
    },
  ]
})
</script>

<style lang="less" scoped>
.ant-select {
  margin-bottom: 32px;
}
</style>