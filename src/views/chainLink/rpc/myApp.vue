<template>
  <div>
    <div class="text-[24px] font-bold mb-[30px]">My Apps</div>
    <div class="text-right mb-[20px]">
      <a-button type="primary" class="w-[130px] !h-[43px]"  @click="createApp">Create</a-button>
    </div>
    <a-table :dataSource="tableData" :columns="columns" :pagination="pagination" style="width:100%">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <!-- <a-button type="link" @click="editApp(record)">Edit</a-button> -->
          <a-button type="link" @click="viewApp(record)">View</a-button>
        </template>
      </template>
    </a-table>
  </div>
  <CreateAppModal :modalType="modalType" :createVisible="createVisible" @hiddenCreateModal="hiddenCreateModal"></CreateAppModal>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { formatDateToLocale } from '@/utils/dateUtil';
import CreateAppModal from './components/CreateAppModal.vue';
import { apiZanApiKeyPage, apiGetZanUserAuthed, apiGetZanAuthUrl } from "@/apis/middlewareRPC"

const router = useRouter()
const createVisible = ref(false);
const modalType = ref('create');
const tableData = ref([])
const columns = reactive([
  {
    title: 'App name',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  // {
  //   title: 'Requests(24h)',
  //   dataIndex: 'Requests(24h)',
  //   key: 'Requests(24h)',
  //   align: 'center',
  // },
  // {
  //   title: 'Failed requests(24h)',
  //   dataIndex: 'Failed requests(24h)',
  //   key: 'Failed requests(24h)',
  //   align: 'center',
  // },
  {
    title: 'Time',
    dataIndex: 'createdTime',
    key: 'createdTime',
    align: 'center',
    customRender: ({ text: date }: any) => formatDateToLocale(date).format("YYYY/MM/DD HH:mm:ss"),
  },
  {
    title: 'Action',
    key: 'action',
    align: 'center',
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
    getTableData()
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    pagination.current = current;
    getTableData()
  },
});
const getTableData = async () => {
  let res = await apiZanApiKeyPage(pagination.current, pagination.pageSize);
  if (res.code == 200) {
    tableData.value = res.data.data;
    pagination.total = res.data.total;
  }
  console.log("table: res:; ",res);
}
const editApp = (item: any) => {
  modalType.value = 'edit';
  createVisible.value = true;
}
const viewApp = (item: any) => {
  router.push(`/middleware/dashboard/RPC/myapp/detail?apiKeyId=${item.apiKeyId}&apiKeyName=${item.name}`)
}
const hiddenCreateModal = () => {
  createVisible.value = false;
}

const createApp = async () => {
  const authedData = await apiGetZanUserAuthed()
  if(authedData.data){
    modalType.value = 'create';
    createVisible.value = true;
  }else {
      let url = ""
      try{
        const authUrlResp = await apiGetZanAuthUrl()
        url = authUrlResp.data
      }catch (e) {
          return
      }
      const myWindow = window.open(url, 'login-zan', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
      myWindow?.focus()
  }
}

onMounted(()=>{
  getTableData();
})
</script>
<style lang="less">
</style>