<template>
    <div>
      <div class="text-[24px] font-bold mb-[25px]">Your Orders</div>
      <div class="dark:bg-[#1D1C1A] rounded-[12px] p-[32px]">
        <div class="mb-[25px] flex">
          <a-range-picker format="YYYY-MM-DD" @change="handleSearch" class="w-1/2" v-model:value="searchData.orderDate" />
          <a-input-search @search="handleSearch" class="ml-[30px]" v-model:value="searchData.keyword" autocomplete="off" placeholder="Search here..."></a-input-search>
        </div>
        <a-table :dataSource="orderListData" :columns="orderColumns" :pagination="pagination" style="width:100%">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <label class="cursor-pointer open-link-css">Pay</label>
              <label class="cursor-pointer open-link-css ml-4">Cancel</label>
            </template>
          </template>
        </a-table>
      </div>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CopyOutlined } from '@ant-design/icons-vue';

const orderListData = ref([{ name: '123' }])
const searchData = ref({
  keyword: '',
  orderDate: '',
})
const orderColumns = reactive([
  {
    title: 'Order Time',
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    customRender: ({ index }:any) => index+1,
  },
  {
    title: 'Order ID',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'Order Type',
    dataIndex: 'chain',
    key: 'chain',
    align: 'center',
  },
  {
    title: 'Resource Type',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: 'Order Status',
    dataIndex: 'ip',
    key: 'ip',
    align: 'center',
  },
  {
    title: 'Chain',
    dataIndex: 'region',
    key: 'region',
    align: 'center',
  },
  {
    title: 'Amount',
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
const handleSearch = (value: any,dateString: any[]) => {
  console.log("searchData: ",value)
  console.log("searchData: ",dateString[0])
}
</script>
<style lang="less">
</style>