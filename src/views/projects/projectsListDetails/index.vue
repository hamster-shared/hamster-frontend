<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <div class="flex justify-between">
      <div class="flex items-center">
        <div class="text-[24px] font-bold cursor-pointer flex items-center" @click="goBack">
          <img
            src="@/assets/icons/back-white.svg"
            class="h-[24px] dark:hidden mr-2"
          />
          <img
            src="@/assets/icons/back-dark.svg"
            class="h-[24px] hidden dark:inline-block mr-2"
          />
          back</div>
        <div class="ml-4">
          <img
            src="@/assets/icons/Line-white.svg"
            class="h-[16px] dark:hidden"
          />
          <img
            src="@/assets/icons/Line-dark.svg"
            class="h-[16px] hidden dark:inline-block"
          />
        </div>
        <div class="ml-4 text-[24px] font-bold">{{ projectsDetail.name }}</div>
        <div class="ml-4 text-[14px] rounded-[32px] py-1 px-4 border border-solid dark:border-[#434343] border-[#EBEBEB]">Contract</div>
      </div>
      <div>
       <a-button type="primary" ghost @click="deleteModal = true;">Delete</a-button>
       <a-button type="primary" class="ml-4" @click="visibleModal = true">Setting</a-button>
      </div>
    </div>
    <div v-if="Object.keys(projectsDetail).length!==0">
      <Overview :viewType="viewType" :viewInfo="projectsDetail"  @loadProjects="loadProjects" />
    </div>
    <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[12px] py-[24px] px-[32px]">
      <div class="flex justify-between">
        <div class="mb-2 items-center text-[24px] font-bold">Workflows</div>
        <div class="select-color">
          <a-select @change="changeAction" v-model:value="action" placeholder="Please enter Network"
          :options="actionList.map(item => ({ value: item.value, label: item.label }))">
          </a-select>
        </div>
      </div>
      <a-table
        class="my-4"
        :columns="tableColumns"
        :dataSource="workflowList"
        :pagination="pagination"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex === 'type'">
            <label v-if="record.type === 1">Contract Check_#{{ record.execNumber}}</label>
            <label v-if="record.type === 2">Contract Build_#{{ record.execNumber}}</label>
          </template>
          <template v-if="column.dataIndex === 'triggerMode'">
            <div v-if="record.triggerMode === 1">manual trigger</div>
            <div>{{ record.codeInfo }}</div>
          </template>
          <template v-if="column.key === 'stageInfo'">
            <StageVue v-if="record.stageInfo !== ''" :stages="JSON.parse(record.stageInfo)" />
          </template>
          <template v-if="column.dataIndex === 'startTime'">
            <div v-if="record.startTime != '0001-01-01T00:00:00Z'">
              <div>{{ fromNowexecutionTime(record.startTime, "noThing") }} action</div>
              <div>{{ formatDurationTime(record.duration, "elapsedTime") }}</div>
            </div>
            <div v-else></div>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <label class="cursor-pointer" @click="goContractWorkflows(record.type,record.id, record.detailId)">Details</label>
            <label v-if="record.status === 1" class="text-[#E2B578] ml-2 cursor-pointer" @click="stopWorkflow(record.projectId, record.id, record.detailId)">Stop</label>
            <label v-if="record.status !== 1" @click="deleteWorkflow(record.id)" class="text-[#FF4A4A] ml-2 cursor-pointer">Delete</label>
          </template>
        </template>
      </a-table>
    </div>
    <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[12px] py-[24px] px-[32px]">
      <div class="flex mb-2 items-center text-[24px] font-bold">Artifacts</div>
      <a-tabs v-model:activeKey="activeKey" @tabClick="handleTabClick">
        <a-tab-pane key="1" tab="Contract">
          <div class="flex">
            <div>
              <a-select @change="changeContract" v-model:value="contract"
              :options="contractList.map(item => ({ value: item }))">
              </a-select>
            </div>
            <div class="ml-4">
              <a-select @change="changeContract" v-model:value="version"
              :options="versionList.map(item => ({ value: item }))">
              </a-select>
            </div>
            <div class="ml-4">
              <a-select @change="changeContract" v-model:value="network"
              :options="networkList.map(item => ({ value: item }))">
              </a-select>
            </div>
          </div>
          <a-table
            class="my-4"
            :columns="contractTableColumns"
            :dataSource="contractTableList"
            :pagination="contractPagination"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'version'">
                <label class="text-[#E2B578]">{{ record.version }}</label>
              </template>
              <template v-if="column.dataIndex === 'network'">
                <label v-if="record.network.String !== '' " v-for="(item, indexF) in record.network.String.split(',')" :key="indexF" :class="{ 'ml-2' : indexF !== 0}" class="text-[#E2B578] border border-solid rounded-[32px] border-[#E2B578] px-3 py-1">{{ item }}</label>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <label class="cursor-pointer" v-if="record.network.String !== '' " @click="goContractDetail(record.version)">Details</label>
                <label class="text-[#E2B578] ml-2 cursor-pointer" @click="goContractDeploy(record.name, record.version)">Deploy</label>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Report">
          <div>
            <a-select @change="changeReport" v-model:value="checkTool"
              :options="checkToolList.map(item => ({ value: item }))">
              </a-select>
          </div>
          <a-table
            class="my-4"
            :columns="reportTableColumns"
            :dataSource="reportTableList"
            :pagination="reportPagination"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'type'">
                <label v-if="record.type === 1">Contract Check</label>
                <label v-if="record.type === 2">Contract Build</label>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <label class="text-[#E2B578] cursor-pointer" @click="goContractWorkflows(record.type,record.workflowId, record.workflowDetailId)">View Report</label>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
  <a-modal v-model:visible="visibleModal" :footer="null">
    <div class="text-[24px] text-[#151210] font-bold mb-4">Edit projectName</div>
    <a-form :model="formData" layout="vertical" ref="formRef" :rules="formRules">
      <a-form-item label="Project Name" name="name" >
        <a-input v-model:value="formData.name" placeholder="Please enter Project Name" allow-clear autocomplete="off" />
      </a-form-item>
    </a-form>
    <div class="text-center mt-4">
      <a-button class="ml-4" type="primary" :loading="loading" @click="updateName">Done</a-button>
    </div>
  </a-modal>
  <a-modal v-model:visible="deleteModal" :footer="null">
    <div class="text-[24px] text-[#151210] font-bold mb-4">Delete</div>
    <div>Are you sure delete this projects?</div>
    <div class="text-center mt-8">
      <a-button type="primary" @click="deleteModal = false">NO</a-button>
      <a-button class="ml-[24px]" type="primary" :loading="loading" @click="deleteProjects">YES</a-button>
    </div>
  </a-modal>
  <a-modal v-model:visible="delWorkflowModal" :footer="null">
    <div class="text-[24px] text-[#151210] font-bold mb-4">Delete</div>
    <div>Are you sure delete this workflows?</div>
    <div class="text-center mt-8">
      <a-button type="primary" @click="delWorkflowModal = false">NO</a-button>
      <a-button class="ml-[24px]" type="primary" :loading="loading" @click="deleteWorkflowContent">YES</a-button>
    </div>
  </a-modal>
</template>
<script lang='ts' setup>
import { reactive, ref, computed, onMounted, onBeforeUnmount } from "vue";
import { fromNowexecutionTime, formatDurationTime } from "@/utils/time/dateUtils.js";
import { useRouter, useRoute } from "vue-router";
import { formatDateToLocale  } from '@/utils/dateUtil';
import Overview from "../projectsList/components/Overview.vue";
import StageVue from "./components/Stage.vue";
import {
  apiGetProjectsDetail,
  apiGetProjectsWorkflows,
  apiGetProjectsContract,
  apiGetProjectsReports,
  apiUpdateProjectsName,
  apiProjectsVersion,
  apiProjectsContractName,
  apiProjectsContractNetwork,
  apiProjectsCheckTools,
  apiDeleteProjects,
  apiProjectsWorkflowsStop,
  apiDeleteWorkflows,
  apiDupProjectName
} from "@/apis/projects";
import { message } from "ant-design-vue";
import { useThemeStore } from "@/stores/useTheme";
import dayjs from "dayjs";
const theme = useThemeStore()

const router = useRouter();
const { params } = useRoute();
const timer = ref(0)
const loading = ref(false)
const detailId = ref(params.id);
const viewType = ref("detail");
const visibleModal = ref(false);
const deleteModal = ref(false);
const delWorkflowModal = ref(false);
const delWorkflowId = ref("");
const formRef = ref();
const userInfo = localStorage.getItem('userInfo');
const formData = reactive({
  name: '',
  userId: JSON.parse(userInfo)?.id,
});
const projectsDetail = ref({});
const activeKey = ref("1");
const actionList = reactive([
  {label:"All Action",value: "0"},
  {label:"Check",value: "1"},
  { label: "Build", value: "2" }
]);
const action = ref("0");
const contractList = ref(["All Contract"]);
const contract = ref("All Contract");
const versionList = ref(["All Version"]);
const version = ref("All Version");
const networkList = ref(["All Network"]);
const network = ref("All Network");
const checkToolList = ref(["All Check Tool"]);
const checkTool = ref("All Check Tool");
const workflowList = ref([]);
const contractTableList = ref([]);
const reportTableList = ref([]);
const statusList = reactive(["Notrun","Running","Fail","Success","Stop"]);

const formRules = computed(() => {

  const checkDupName = async () => {
    try {
      //校验仓库名称是否存在
      const params = {
        owner: JSON.parse(userInfo)?.username,
        name: formData.name,
      }
      const res = await apiDupProjectName(params);
      if (res.data === false) {
        return Promise.reject("Project Name duplication");
      } else {
        return Promise.resolve()
      }
    } catch (error: any) {
      console.log("erro:",error)
      return Promise.reject("Project Name check failure");
    }
  }

  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });

  return {
    name: [requiredRule('Name'),{ validator: checkDupName, trigger: "change" }],
  };
});

const tableColumns = computed<any[]>(() => [
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    ellipsis: 'fixed',
    key: 'status',
    customRender: ({ text }) => statusList[text]
  },
  {
    title: 'Action',
    dataIndex: 'type',
    align: 'center',
    ellipsis: 'fixed',
    key: 'type',
  },
  {
    title: 'Trigger Info',
    dataIndex: 'triggerMode',
    key: 'triggerMode',
    ellipsis: 'fixed',
    align: 'center',
  },
  {
    title: 'Stage',
    dataIndex: 'stageInfo',
    align: 'center',
    ellipsis: 'fixed',
    key: 'stageInfo',
    width: '200px'
  },
  {
    title: 'Time',
    dataIndex: 'startTime',
    align: 'center',
    ellipsis: 'fixed',
    key: 'startTime',
    width: '150px'
  },
  {
    title: '操作',
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
    // getApps();
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    pagination.current = current;
    // getApps();
  },
  // showTotal: total => `总数：${total}人`, // 可以展示总数
});


const contractTableColumns = computed<any[]>(() => [
  {
    title: 'Contract',
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
    key: 'version',
  },
  {
    title: 'Network',
    dataIndex: 'network',
    key: 'network',
    ellipsis: 'fixed',
    align: 'center',
  },
  {
    title: 'Build Time',
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

const contractPagination = reactive({
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
    contractPagination.current = current;
    contractPagination.pageSize = pagesize;
    getProjectsContract();
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    contractPagination.current = current;
    getProjectsContract();
  },
  // showTotal: total => `总数：${total}人`, // 可以展示总数
});

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
  getProjectsDetail();
  getProjectsWorkflows();
  getProjectsContract();
  getProjectsReports();
  getProjectsVersion();
  getProjectsContractName();
  getProjectsContractNetwork();
  getProjectsCheckTools();

  timer.value = window.setInterval(() => {
      // 其他定时执行的方法
    getProjectsDetail();
    getProjectsWorkflows();
  }, 5000);
})

onBeforeUnmount(()=>{ //离开当前组件的生命周期执行的方法
    window.clearInterval(timer.value);
})

const loadProjects = () => {
  getProjectsDetail();
}

const handleTabClick = (tab: any) => {
  if (tab === "1") {
    getProjectsContract();
  } else if (tab === "2") {
    getProjectsReports();
  }
}

const getProjectsDetail = async () => {
  try {
    const { data } = await apiGetProjectsDetail(detailId.value.toString());
    projectsDetail.value = data;

    const recentStatusOld = localStorage.getItem('recentStatus'+data.name);
    if (recentStatusOld !== null && recentStatusOld !== undefined) {
      // running - success
      if (JSON.parse(recentStatusOld)?.checkStatus === 1 && data.recentCheck.status === 3
        || JSON.parse(recentStatusOld)?.buildStatus === 1 && data.recentBuild.status === 3) {
        getProjectsContract();
        getProjectsReports();
      }
    }
    const recentStatus = {
      checkStatus: data.recentCheck.status,
      buildStatus: data.recentBuild.status,
    }
    window.localStorage.setItem("recentStatus"+data.name, JSON.stringify(recentStatus));

    localStorage.setItem("projectName", data.name)
    localStorage.setItem("projectId", data.id)
    
  } catch (error: any) {
    console.log("erro:",error)
  } finally {
    // loading.value = false;
  }
};
const changeAction = async () => {
  pagination.current = 1;
  getProjectsWorkflows();
}
const getProjectsWorkflows = async () => {
  try {
    const params = {
      type: action.value,
      page: pagination.current,
      size: pagination.pageSize,
    }
    const { data } = await apiGetProjectsWorkflows(detailId.value.toString(), params);
    workflowList.value = data.data;
    pagination.total = data.total

  } catch (error: any) {
    console.log("erro:",error)
  } finally {
    // loading.value = false;
  }
};

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
    console.log("erro:",error)
  } finally {
    // loading.value = false;
  }
};

const getProjectsVersion = async () => {
  try {
    const { data } = await apiProjectsVersion(detailId.value.toString());
    versionList.value.length = 1;
    versionList.value = versionList.value.concat(data);

  } catch (error: any) {
    console.log("erro:",error)
  } finally {
    // loading.value = false;
  }
};

const getProjectsContractName = async () => {
  try {
    const { data } = await apiProjectsContractName(detailId.value.toString());
    contractList.value.length = 1;
    contractList.value = contractList.value.concat(data);

  } catch (error: any) {
    console.log("erro:",error)
  } finally {
    // loading.value = false;
  }
};

const getProjectsContractNetwork = async () => {
  try {
    const { data } = await apiProjectsContractNetwork(detailId.value.toString());
    networkList.value.length = 1;
    networkList.value = networkList.value.concat(data);

  } catch (error: any) {
    console.log("erro:",error)
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
    console.log("erro:",error)
  } finally {
    // loading.value = false;
  }
}

const changeContract = async () => {
  contractPagination.current = 1;
  getProjectsContract();
}
const getProjectsContract = async () => {
  try {
    const params = {
      query: contract.value === 'All Contract' ? "" : contract.value,
      version: version.value === 'All Version' ? "" : version.value,
      network: network.value === 'All Network' ? "" : network.value,
      page: contractPagination.current,
      size: contractPagination.pageSize,
    }
    const { data } = await apiGetProjectsContract(detailId.value.toString(), params);
    contractTableList.value = data.data;
    contractPagination.total = data.total

  } catch (error: any) {
    console.log("erro:",error)
  } finally {
    // loading.value = false;
  }
};

const updateName = async () => {
  await formRef.value.validate();

  try {
    loading.value = true;
    const data = await apiUpdateProjectsName(detailId.value.toString(), formData);
    message.success(data.message);
    projectsDetail.value.name = formData.name;
  } catch (error: any) {
    console.log("erro:",error)
    message.error(error.response.data.message);
  } finally {
    visibleModal.value = false;
    loading.value = false;
  }
}
const deleteProjects = async () => {

  try {
    loading.value = true;
    const data = await apiDeleteProjects(detailId.value.toString());
    message.success(data.message);
    router.push("/projects");
  } catch (error: any) {
    console.log("erro:",error)
    message.error(error.response.data.message);
  } finally {
    deleteModal.value = false;
    loading.value = false;
  }
}
const stopWorkflow = async (projectId: String,workflowId: number, detailId: number) => {
  try {
    const params = reactive({
      id: projectId,
      workflowsId: workflowId,
      workflowDetailId: detailId,
    })
    const data = await apiProjectsWorkflowsStop(params);
    message.success(data.message);
  } catch (error: any) {
    console.log("error:",error)
    message.error(error.response.data.message);
  } finally {
    visibleModal.value = false;
  }

}
const deleteWorkflow = (workflowId: string) => {
  delWorkflowId.value = workflowId;
  delWorkflowModal.value = true;
}
const deleteWorkflowContent = async () => {
  try {
    loading.value = true;
    const data = await apiDeleteWorkflows(detailId.value.toString(), delWorkflowId.value);
    message.success(data.message);
    getProjectsWorkflows();
  } catch (error: any) {
    console.log("erro:",error)
    message.error(error.response.data.message);
  } finally {
    delWorkflowModal.value = false;
    loading.value = false;
  }
}
const goContractDetail = async (version: String) => {
  router.push("/projects/"+detailId.value+"/contracts-details/"+version);
}
const goContractDeploy = async (contract: String, version: String) => {
  router.push("/projects/"+detailId.value+"/artifacts-contract/"+version+"/deploy/"+contract);
};
const goContractWorkflows = (type: String, workflowId: String, workflowDetailId: String) => {
  router.push("/projects/"+detailId.value+"/"+workflowId+"/workflows/"+workflowDetailId+"/"+type);
}
const goBack = () => {
   router.back();
}
</script>
<style lang='less' scoped>
@baseColor: #E2B578;
:deep(.ant-btn-primary){
  width: 120px;
  height: 40px;
}
:deep(.dark-css .ant-tabs){
  color: #E0DBD2;
}
:deep(.ant-input-affix-wrapper){
  border-color: #EBEBEB;
}
:deep(.white-css .select-color .ant-select-selection-item){
  color: var(--ant-primary-color);
}
</style>
