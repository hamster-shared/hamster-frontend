<template>
  <div v-if="projectType=='1' && frameType=='1'">
    <!-- OptionsList -->
    <a-select @change="changeReport" v-model:value="OptionsList" :options="RightData" style="margin-right:10px;width:250px"></a-select>
    <!-- checkReportsList -->
    <a-select @change="changePort" v-model:value="Options" :options="LeftData" style="width:225px"></a-select>

  </div>
  <a-table class="my-4" :columns="reportTableColumns" :dataSource="reportTableList" :pagination="reportPagination">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'issues'">
        <label v-if="record.issues">{{record.issues}} issues found</label>
        <label v-else>-</label>
      </template>
      <template v-if="column.dataIndex === 'type'">
        <label v-if="record.type === 1">Contract Check</label>
        <label v-if="record.type === 2">Contract Build</label>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <label class="open-link-css cursor-pointer"
          @click="goContractWorkflows(record.type, record.workflowId, record.workflowDetailId)">View Report</label>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs, defineProps, defineExpose } from 'vue';
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
  frameType:String,
});
const { detailId, projectType,frameType } = toRefs(props);
const Options=ref("All Check Tools")
const OptionsList=ref('All Reports')

const reportTableList = ref([]);

const reportTableColumns = computed<any[]>(() => [
  {
    title:'Report',
    // title: 'Report Name',
    dataIndex: 'name',
    align: 'center',
    ellipsis: 'fixed',
    key: 'name',
  },
  {
    title:'Check Tools',
    // title: 'Report Type',
    dataIndex: 'checkTool',
    align: 'center',
    ellipsis: 'fixed',
    key: 'checkTool',
  },
  {
    title:'issues',
    // title: 'Check Tool',
    dataIndex: 'issues',
    key: 'issues',
    ellipsis: 'fixed',
    align: 'center',
  },
  // {
  //   title: 'Result',
  //   dataIndex: 'result',
  //   align: 'center',
  //   ellipsis: 'fixed',
  //   key: 'result',
  //   width: '200px'
  // },
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

//左侧下拉框数据
const LeftData = ref([
      {
        value: 'All Check Tools',
        label: 'All Check Tools',
      },
      {
        value: 'MetaTrust (SA)',
        label: 'MetaTrust (SA)',
      },
      {
        value: 'MetaTrust (SP)',
        label: 'MetaTrust (SP)',
      },
      {
        value: 'MetaTrust (OSA)',
        label: 'MetaTrust (OSA)',
      },
      {
        value: 'MetaTrust (CQ)',
        label: 'MetaTrust (CQ)',
      },
      {
        value:'Mythril',
        label:'Mythril',
      },
      {
        value:'Solhint',
        label:'Solhint',
      },
      {
        value:'eth-gas-reporter',
        label:'eth-gas-reporter',
      },
      {
        value:'Al',
        label:'Al',
      }
    ]);

//右侧下拉框数据
const RightData = ref([
  {
    value: 'All Report Type',
    label: 'All Report Type',
  },
  {
    value: 'Security Analysis Report',
    label: 'Security Analysis Report',
  },
  {
    value: 'Open Source Analysis Report',
    label: 'Open Source Analysis Report',
  },
  {
    value: 'Code Quality Analysis Report',
    label: 'Code Quality Analysis Report',
  },
  {
    value: 'Gas Usage Analysis Report',
    label: 'Gas Usage Analysis Report',
  },
  {
    value:'Other Analysis Report',
    label:'Other Analysis Report',
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

//左侧change事件
const changeReport = async (type:string) => {
  reportPagination.current = 1;
  getProjectsReports();
  OptionsList.value = type
}
//右侧change事件
const changePort=async(reportType:string)=>{
  reportPagination.current = 1;
  console.log(reportType)
  Options.value = reportType
  getProjectsReports();
}

const getProjectsReports = async () => {
  try {
    const params = {
      type: Options.value === 'All Check Tools' ? "" : Options.value,
      page: reportPagination.current,
      size: reportPagination.pageSize,
      reportType:(OptionsList.value === 'All Report Type' || OptionsList.value === 'All Reports') ? "" : OptionsList.value
    }
    const { data } = await apiGetProjectsReports(detailId.value.toString(), params);
    reportTableList.value = data.data;
    reportPagination.total = data.total

  } catch (error: any) {
    console.log("Error:", error)
  } finally {
    // loading.value = false;
  }
};

const getProjectsCheckTools = async () => {
  try {
    const { data } = await apiProjectsCheckTools(detailId.value.toString());
    console.log('getProjectsCheckTools',data)
  } catch (error: any) {
    console.log("Error:", error)
  } finally {
  }
}

const goContractWorkflows = (type: String, workflowId: String, workflowDetailId: String) => {
  router.push("/projects/" + detailId.value + "/" + workflowId + "/workflows/" + workflowDetailId + "/" + type + "/" + projectType?.value);
}

defineExpose({
  getProjectsReports
})
</script>