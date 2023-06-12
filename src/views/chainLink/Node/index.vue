<template>
    <div>
      <div class="flex justify-between mb-[25px]">
        <div class="text-[24px] font-bold">Node</div>
        <a-button type="primary" @click="launchNode">Launch Node</a-button>
      </div>
      <a-table :dataSource="nodeListData" :columns="nodeColumns" :pagination="pagination" style="width:100%">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button type="link">Detail</a-button>
          </template>
        </template>
      </a-table>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute()
const nodeListData = ref([{name:'123'}])
const nodeColumns = reactive([
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    customRender: ({ index }:any) => index+1,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'Chain',
    dataIndex: 'chain',
    key: 'chain',
    align: 'center',
  },
  {
    title: 'Node Status',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: 'Public IP',
    dataIndex: 'ip',
    key: 'ip',
    align: 'center',
  },
  {
    title: 'Region',
    dataIndex: 'region',
    key: 'region',
    align: 'center',
  },
  {
    title: 'Action',
    key: 'action',
    align: 'center'
  },
])
const pagination = reactive({
  // 分页配置器
  pageSize: 10, // 一页的数据限制
  current: 1, // 当前页
  total: 10, // 总数
  size: 'small',
  position: ['bottomCenter'], //指定分页显示的位置
  hideOnSinglePage: false, // 只有一页时是否隐藏分页器
  showQuickJumper: false, // 是否可以快速跳转至某页
  showSizeChanger: false, // 是否可以改变 pageSize
  pageSizeOptions: ['10', '20', '30'], // 指定每页可以显示多少条
  onShowSizeChange: (current: number, pagesize: number) => {
    // 改变 pageSize时的回调
    pagination.current = current;
    pagination.pageSize = pagesize;
    getTableData(current, pagesize)
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    pagination.current = current;
    getTableData(current, pagination.pageSize)
  },
});
const getTableData = async(page:number = pagination.current, size:number = pagination.pageSize) => {
  const token = localStorage.getItem('token')
  const params = {
    page,
    size,
    token
  }
  try {
    // const { data } = await apiGetOracleTableParams(params)
    // pagination.total = data.total
    // pagination.current = data.page
    // pagination.pageSize = data.pageSize
    // oracleListData.value = data.data
    // console.log('tableData:', oracleListData.value)
  } catch(err:any) {
    console.log('tableDataErr:', err)
  }
}
const launchNode = () => {
  router.push(route.fullPath + "/create");
}
</script>
<style lang="less">
</style>