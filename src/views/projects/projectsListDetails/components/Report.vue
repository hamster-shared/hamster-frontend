<template>
  <div>
    <a-select @change="changeReport" v-model:value="checkTool" :options="checkToolList.map(item => ({ value: item }))">
    </a-select>
  </div>
  <a-table class="my-4" :columns="reportTableColumns" :dataSource="reportTableList" :pagination="reportPagination">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'type'">
        <label v-if="record.type === 1">Contract Check</label>
        <label v-if="record.type === 2">Contract Build</label>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <label class="text-[#E2B578] cursor-pointer"
          @click="goContractWorkflows(record.type, record.workflowId, record.workflowDetailId)">View Report</label>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs } from 'vue';
import { useRouter } from "vue-router";
import { formatDateToLocale } from '@/utils/dateUtil';
import {
  apiGetProjectsReports,
  apiProjectsCheckTools,
} from "@/apis/projects";

const router = useRouter();
const props = defineProps({
  detailId: String,
  projectType: String,
});
const { detailId, projectType } = toRefs(props);

const checkToolList = ref(["All Check Tool"]);
const checkTool = ref("All Check Tool");
const reportTableList = ref([]);

const reportTableColumns = computed<any[]>(() => [
  {
    title: 'Report Name',
    dataIndex: 'name',
    align: 'center',
    ellipsis: 'fixed',
    key: 'name',
  },
  {
    title: 'Report Type',
    dataIndex: 'type',
    align: 'center',
    ellipsis: 'fixed',
    key: 'type',
  },
  {
    title: 'Check Tool',
    dataIndex: 'checkTool',
    key: 'checkTool',
    ellipsis: 'fixed',
    align: 'center',
  },
  {
    title: 'Result',
    dataIndex: 'result',
    align: 'center',
    ellipsis: 'fixed',
    key: 'result',
    width: '200px'
  },
  {
    title: 'Check Time',
    dataIndex: 'checkTime',
    align: 'center',
    ellipsis: 'fixed',
    key: 'checkTime',
    customRender: ({ text: date }) => formatDateToLocale(date).format("YYYY/MM/DD HH:mm:ss"),
  },
  {
    title: 'Action',
    dataIndex: 'action',
    align: 'center',
    width: '150px',
  },
]);

const reportPagination = reactive({
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
    reportPagination.current = current;
    reportPagination.pageSize = pagesize;
    getProjectsReports();
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    reportPagination.current = current;
    getProjectsReports();
  },
  // showTotal: total => `总数：${total}人`, // 可以展示总数
});

onMounted(() => {
  getProjectsReports();
  getProjectsCheckTools();
})

const changeReport = async () => {
  reportPagination.current = 1;
  getProjectsReports();
}

const getProjectsReports = async () => {
  try {
    const params = {
      type: checkTool.value === 'All Check Tool' ? "" : checkTool.value,
      page: reportPagination.current,
      size: reportPagination.pageSize,
    }
    const { data } = await apiGetProjectsReports(detailId.value.toString(), params);
    reportTableList.value = data.data;
    reportPagination.total = data.total

  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
};

const getProjectsCheckTools = async () => {
  try {
    const { data } = await apiProjectsCheckTools(detailId.value.toString());
    checkToolList.value.length = 1;
    checkToolList.value = checkToolList.value.concat(data);

  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
}
const goContractWorkflows = (type: String, workflowId: String, workflowDetailId: String) => {
  router.push("/projects/" + detailId.value + "/" + workflowId + "/workflows/" + workflowDetailId + "/" + type + "/" + projectType?.value);
}

defineExpose({
  getProjectsReports
})
</script>