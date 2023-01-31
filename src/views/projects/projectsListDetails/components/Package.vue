<template>
  <a-table
    class="my-4"
    :columns="tableColumns"
    :dataSource="tableList"
    :pagination="pagination"
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'branch'">
        branch
      </template>
      <template v-if="column.dataIndex === 'action'">
        <label class="text-[#E2B578] cursor-pointer" @click="goDeploy()">Deploy</label>
        <label class="text-[#E2B578] cursor-pointer" @click="goView()">View</label>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs } from 'vue';
import { formatDateToLocale  } from '@/utils/dateUtil';

const props = defineProps({
  detailId: String,
});
const { detailId } = toRefs(props);

const tableList = ref([]);

const tableColumns = computed<any[]>(() => [
  {
    title: 'Report Name',
    dataIndex: 'name',
    align: 'center',
    ellipsis: 'fixed',
    key: 'name',
  },
  {
    title: 'Version',
    dataIndex: 'version',
    align: 'center',
    ellipsis: 'fixed',
    key: 'type',
  },
  {
    title: 'Branch',
    dataIndex: 'branch',
    key: 'branch',
    ellipsis: 'fixed',
    align: 'center',
  },
  {
    title: 'Build Time',
    dataIndex: 'buildTime',
    align: 'center',
    ellipsis: 'fixed',
    key: 'checkTime',
    customRender: ({ text: date }) => formatDateToLocale(date).format("YYYY/MM/DD HH:mm:ss"),
  },
  {
    title: 'Domains',
    dataIndex: 'domains',
    key: 'domains',
    ellipsis: 'fixed',
    align: 'center',
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
    getProjectsPackage();
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    pagination.current = current;
    getProjectsPackage();
  },
  // showTotal: total => `总数：${total}人`, // 可以展示总数
});

onMounted(() => {
  getProjectsPackage();
})

const getProjectsPackage = () => {

}

const goDeploy = () => {

}

const goView = () => {

}
</script>