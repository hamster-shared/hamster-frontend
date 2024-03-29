<template>
  <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[12px] py-[24px] px-[32px]">
    <div class="mb-2 items-center text-[24px] font-bold">Canisters</div>
    <a-table class="my-4" :columns="tableColumns" :dataSource="tableList" :pagination="pagination">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'status'">
          <label>{{CanisterStatusEnum[record.status]}}</label>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <label class="open-link-css cursor-pointer" @click="handleAddCycles(record)">Add Cycles</label>
        </template>
      </template>
    </a-table>
  </div>
  <CustomMsg v-if="showMsg" :showMsg="showMsg" :msgType="msgType" :msgParam="msgParam" @handleCancel="showMsg = false" @showBuyCycle="showBuyCycle = true"></CustomMsg>
  <AddCycles v-if="showAddCycle" :visible="showAddCycle" :canisterId="canisterId" :cycles="cycles" @handleCancel="cancelAddCycle" @showBuyCycles="showBuyCycle=true" @showBuyCycleMsg="showBuyCycleMsg" @refreshCanister="refreshCanister"></AddCycles>
  <BuyCycles v-if="showBuyCycle" :visible="showBuyCycle" @handleCancel="showBuyCycle = false"></BuyCycles>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs } from 'vue';
import { formatDateToLocale } from '@/utils/dateUtil';
import CustomMsg from '@/components/CustomMsg.vue';
import AddCycles from "./AddCycles.vue"
import BuyCycles from "./BuyCycles.vue"
import { apiCanisterList } from '@/apis/canister'
import { CanisterStatusEnum } from '@/enums/frameTypeEnum'

const props = defineProps({
  detailId: String,
  frameType: Number
});
const { detailId, frameType } = toRefs(props);
const showAddCycle = ref(false);
const showBuyCycle = ref(false);
const showMsg = ref(false);
const msgType = ref('byCycles');
const msgParam = ref({});
const canisterId = ref()
const cycles = ref()

const tableList = ref([{'name':'name'}]);

const tableColumns = ref([
  {
    title: 'Canister ID',
    dataIndex: 'canisterId',
    align: 'center',
    ellipsis: 'fixed',
    key: 'canisterId',
  },
  {
    title: 'Canister Name',
    dataIndex: 'canisterName',
    align: 'center',
    ellipsis: 'fixed',
    key: 'canisterName',
  },
  {
    title: 'Contract',
    dataIndex: 'contract',
    align: 'center',
    ellipsis: 'fixed',
    key: 'contract',
  },
  {
    title: 'Cycles',
    dataIndex: 'cycles',
    key: 'cycles',
    ellipsis: 'fixed',
    align: 'center',
    // 加上单位
    customRender: ({ text }) => `${text} T`
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    ellipsis: 'fixed',
    align: 'center',
  },
  {
    title: 'Update at',
    dataIndex: 'updateTime',
    align: 'center',
    ellipsis: 'fixed',
    key: 'updateTime',
    customRender: ({ text: date }) => formatDateToLocale(date).format("YYYY/MM/DD HH:mm:ss"),
  },
  {
    title: 'Action',
    dataIndex: 'action',
    align: 'center',
    width: '150px',
  },
]);

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
    getProjectsCanisters();
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    pagination.current = current;
    getProjectsCanisters();
  },
  // showTotal: total => `总数：${total}人`, // 可以展示总数
});
onMounted(() => {
  if (frameType?.value !== 7) {
    tableColumns.value = tableColumns.value.filter(item => item.dataIndex !== 'contract')
  }
  
  getProjectsCanisters()
})

const getProjectsCanisters = async () => {
  try {
    const params = {
      page: pagination.current,
      size: pagination.pageSize,
    }
    const { data } = await apiCanisterList(detailId?.value, params);
    tableList.value = data.data;
    pagination.total = data.total

  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
}

const handleAddCycles = (record:any) => {
  canisterId.value = record.canisterId
  cycles.value = record.cycles
  showAddCycle.value = true; //显示弹框
  console.log('handleAddCycles',record)
}
const cancelAddCycle = () => {
  showAddCycle.value = false;
}

const showBuyCycleMsg = ()=>{
  showAddCycle.value = false
  showMsg.value = true
}

// 充值完成后需要刷新罐列表
const refreshCanister = ()=>{
  getProjectsCanisters()
}
</script>
<style scoped lang="less">
</style>