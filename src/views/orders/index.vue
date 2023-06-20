<template>
  <div>
    <div class="text-[24px] font-bold mb-[25px]">Your Orders</div>
    <div class="dark:bg-[#1D1C1A] rounded-[12px] p-[32px]">
      <div class="mb-[25px] flex">
        <a-range-picker format="YYYY-MM-DD" @change="handleSearchDate" class="w-1/2" v-model:value="searchData.orderDate" />
        <a-input-search @search="getTableData()" class="ml-[30px]" v-model:value="searchData.query" autocomplete="off" placeholder="Search here..."></a-input-search>
      </div>
      <a-table :dataSource="orderListData" :columns="orderColumns" :pagination="pagination" style="width:100%">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'orderId'">
            <label>{{record.orderId}} <svg-icon name="copy" size="18" @click="copyToClipboard(record.orderId)" /></label>
          </template>
          <template v-if="column.dataIndex === 'resourceType'">
            <label>{{record.resourceType.substring(0, record.resourceType.lastIndexOf("|"))}}<br/>
              {{record.resourceType.substring(record.resourceType.lastIndexOf("|")+1)}} | {{record.buyTime}} Month</label>
          </template>
          <template v-if="column.dataIndex === 'amount'">
            <label>{{record.amount}} USDT <br/>= ${{record.amount}}</label>
          </template>
          <template v-if="column.key === 'action'">
            <label v-if="record.status === 1">
              <label class="cursor-pointer open-link-css" @click="orderPay(record.id)">Pay</label>
              <label class="cursor-pointer open-link-css ml-4" @click="orderCancel(record.id)">Cancel</label>
            </label>
            <label v-else>-</label>
          </template>
        </template>
      </a-table>
    </div>
  </div>
    
  <a-modal v-model:visible="cancelModal" :footer="null">
    <div class="text-[24px] text-[#151210] font-bold mb-4">Cancel</div>
    <div>Are you sure cancel this order?</div>
    <div class="mt-8 text-center">
      <a-button type="primary" @click="cancelModal = false">NO</a-button>
      <a-button class="ml-[24px]" type="primary" :loading="loading" @click="orderCancelContent">YES</a-button>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { formatDateToLocale } from '@/utils/dateUtil';
import { copyToClipboard } from '@/utils/tool'
import { OrderStatusEnum ,OrderTypeEnum } from "@/enums/statusEnum";
import { apiGetOrderList } from "@/apis/node";
import { apiCloseOrder } from "@/apis/chainlink";
import { message } from 'ant-design-vue';

const cancelModal = ref(false);
const loading = ref(false);
const cancelId = ref();
const orderListData = ref([])
const searchData = ref({
  query: '',
  orderDate: '',
  'X-Start': '',
  'X-End': '',
})
const orderColumns = reactive([
  {
    title: 'Order Time',
    dataIndex: 'orderTime',
    key: 'orderTime',
    customRender: ({ text: date }:any) => formatDateToLocale(date.Time).format("YYYY/MM/DD HH:mm:ss"),
  },
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    key: 'orderId',
  },
  {
    title: 'Order Type',
    dataIndex: 'orderType',
    key: 'orderType',
    customRender: ({text}:any) => `${OrderTypeEnum[text]}`,
  },
  {
    title: 'Resource Type',
    dataIndex: 'resourceType',
    key: 'resourceType',
  },
  {
    title: 'Order Status',
    dataIndex: 'status',
    key: 'status',
    customRender: ({text}:any) => `${OrderStatusEnum[text]}`,
  },
  {
    title: 'Chain',
    dataIndex: 'chain',
    key: 'chain',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Action',
    key: 'action',
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

  const params = {
    page: page,
    size: size,
    query: searchData.value.query,
    'X-Start': searchData.value['X-Start'],
    'X-End': searchData.value['X-End'],
  }
  try {
    const { data } = await apiGetOrderList(params)
    
    pagination.total = data.total
    pagination.current = data.page
    pagination.pageSize = data.pageSize
    orderListData.value = data.data
    
  } catch(err:any) {
    console.log('tableDataErr:', err)
  }
}
const handleSearchDate = (value: any, dateString: any[]) => {
  searchData.value['X-Start'] = dateString[0];
  searchData.value['X-End'] = dateString[1];
  getTableData()
}
const orderPay = (id: number) => {
  window.open('/middleware/pay?id='+ id)
}
const orderCancel = (id: number) => {
  cancelId.value = id;
  cancelModal.value = true;
}
const orderCancelContent = async () => {
  try {
    const res = await apiCloseOrder(cancelId.value)
    if (res.code === 200) {
      cancelModal.value = false;
      getTableData();
      message.success(res.message);
    }
  } catch(err:any) {
    message.error(err.response.data.message);
  }
}
onMounted(() => {
  getTableData();
})
</script>
<style lang="less">

.svg-icon{
  color: #E2B578;
}
</style>