<template>
  <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[12px] py-[24px] px-[32px]">
    <div class="mb-2 items-center text-[24px] font-bold">Canisters</div>
    <a-table class="my-4" :columns="tableColumns" :dataSource="tableList" :pagination="pagination">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'action'">
          <label class="open-link-css cursor-pointer">Add Cycles</label>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs } from 'vue';
import { formatDateToLocale } from '@/utils/dateUtil';

const props = defineProps({
  detailId: String
});
const { detailId } = toRefs(props);

const tableList = ref([{'name':'name'}]);

const tableColumns = computed<any[]>(() => [
  {
    title: 'Canister ID',
    dataIndex: 'name',
    align: 'center',
    ellipsis: 'fixed',
    key: 'name',
  },
  {
    title: 'Canister Name',
    dataIndex: 'version',
    align: 'center',
    ellipsis: 'fixed',
    key: 'type',
  },
  {
    title: 'Cycles',
    dataIndex: 'branch',
    key: 'branch',
    ellipsis: 'fixed',
    align: 'center',
  },
  {
    title: 'Status',
    dataIndex: 'domain',
    key: 'domain',
    ellipsis: 'fixed',
    align: 'center',
  },
  {
    title: 'Update at',
    dataIndex: 'buildTime',
    align: 'center',
    ellipsis: 'fixed',
    key: 'buildTime',
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
  getProjectsCanisters()
})

const getProjectsCanisters = async () => {
  // try {
  //   const params = {
  //     page: pagination.current,
  //     size: pagination.pageSize,
  //   }
  //   const { data } = await apiGetProjectsPackages(detailId?.value, params);
  //   tableList.value = data.data;
  //   pagination.total = data.total

  // } catch (error: any) {
  //   console.log("erro:", error)
  // } finally {
  //   // loading.value = false;
  // }
}
</script>