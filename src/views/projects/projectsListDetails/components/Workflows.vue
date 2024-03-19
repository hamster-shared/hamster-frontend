<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'"
    class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[12px] py-[24px] px-[32px]">
    <div class="flex justify-between">
      <div class="mb-2 items-center text-[24px] font-bold">Workflows</div>
      <div class="select-color">
        <a-select @change="changeAction" v-model:value="action" placeholder="Please enter Network"
          :options="actionList.map(item => ({ value: item.value, label: item.label }))">
        </a-select>
      </div>
    </div>
    <a-table class="my-4" :columns="tableColumns" :dataSource="workflowList" :pagination="pagination">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'type'">
          <div v-if="projectType === '1'">
            <label v-if="record.type === 1">Contract Check_#{{ record.execNumber }}</label>
            <label v-if="record.type === 2">Contract Build_#{{ record.execNumber }}</label>
            <label v-if="record.type === 3">Contract Deploy_#{{ record.execNumber }}</label>
          </div>
          <div v-else-if="projectType === '2'">
            <label v-if="record.type === 1">FrontEnd Check_#{{ record.execNumber }}</label>
            <label v-if="record.type === 2">FrontEnd Build_#{{ record.execNumber }}</label>
            <label v-if="record.type === 3">FrontEnd Deploy_#{{ record.execNumber }}</label>
          </div>
          <div v-else-if="projectType === '3'">
            <label v-if="record.type === 1">Node Check_#{{ record.execNumber }}</label>
            <label v-if="record.type === 2">Node Build_#{{ record.execNumber }}</label>
            <label v-if="record.type === 3">Node Deploy_#{{ record.execNumber }}</label>
          </div>
        </template>
        <template v-if="column.dataIndex === 'triggerMode'">
          <div v-if="record.triggerMode === 1">manual trigger</div>
          <div>{{ record.branch }} | {{record.commitId}}</div>
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
          <label class="cursor-pointer open-link-css hover:text-[#E4C08F] active:text-[#CE9C58]"
            @click="goWorkflowsDetail(record.type, record.id, record.detailId, record)">Details</label>
          <label v-if="record.status === 1 && frameType != 1" class=" text-[#FF8A5B] hover:text-[#EBA183] active:text-[#EA7D51] ml-2 cursor-pointer"
            @click="stopWorkflow(record.projectId, record.id, record.detailId)">Stop</label>
            <!-- evm没有删除 -->
          <label v-if="record.status !== 1 && frameType != 1" @click="deleteWorkflow(record.id, record.detailId)"
            class="text-[#F52222] hover:text-[#EE6A6A] active:text-[#CF2C2C] ml-2 cursor-pointer ">Delete</label>
        </template>
      </template>
    </a-table>
  </div>
  <a-modal v-model:visible="delWorkflowModal" :footer="null">
    <div class="text-[24px] text-[#151210] font-bold mb-4">Delete</div>
    <div>Are you sure delete this workflows?</div>
    <div class="mt-8 text-center">
      <a-button type="primary" @click="delWorkflowModal = false">NO</a-button>
      <a-button class="ml-[24px]" type="primary" :loading="loading" @click="deleteWorkflowContent">YES</a-button>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, reactive, ref, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { fromNowexecutionTime, formatDurationTime } from "@/utils/time/dateUtils.js";
import { useThemeStore } from "@/stores/useTheme";
import StageVue from "./Stage.vue";
import { message } from "ant-design-vue";
import {
  apiGetProjectsWorkflows,
  apiProjectsWorkflowsStop,
  apiDeleteWorkflows,
} from "@/apis/projects";
const theme = useThemeStore()
const router = useRouter();

const props = defineProps({
  detailId: String,
  projectType: String,
  frameType: Number,
});
const { detailId, projectType, frameType } = toRefs(props);

const timer = ref();
const loading = ref(false);
const statusList = reactive(["Notrun", "Running", "Fail", "Success", "Stop"]);
// const actionList = reactive([]);
const actionList = ref([
  { label: "All Action", value: "0" },
  { label: "Check", value: "1" },
  { label: "Build", value: "2" },
  { label: "Deploy", value: "3" }
]);

const action = ref("0");
const workflowList = ref([]);
const delWorkflowModal = ref(false);
const delWorkflowId = ref("");
const delWorkflowDetailId = ref();

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
    width: '220px'
  },
  {
    title: 'Time',
    dataIndex: 'startTime',
    align: 'center',
    ellipsis: 'fixed',
    key: 'startTime',
    width: '165px'
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
    // getApps();
    getProjectsWorkflows()
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    pagination.current = current;
    // getApps();
    getProjectsWorkflows()
  },
  // showTotal: total => `总数：${total}人`, // 可以展示总数
});

onMounted(() => {
  getProjectsWorkflows();
})

onBeforeUnmount(() => {
  clearTimeout(timer.value);
})


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

    const isRunning = ref(false);
    workflowList.value.forEach(element => {
      if (element.status === 1) {
        isRunning.value = true;
      }
    });
    if (isRunning.value === true) {

      timer.value = setTimeout(() => {
        //需要定时执行的代码
        getProjectsWorkflows();
      }, 5000)
    } else {
      clearTimeout(timer.value);
    }
  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
};
const goWorkflowsDetail = (type: String, workflowId: String, workflowDetailId: String, record?:any) => {
  // type 1check 2build 3deploy
  if (type == '1') {
    router.push("/projects/" + detailId.value + "/" + workflowId + "/workflows/" + workflowDetailId + "/" + type + "/" + projectType?.value);
  } else if(type == '2'){
    router.push("/projects/" + detailId.value + "/" + workflowId + "/workflows/" + workflowDetailId + "/" + type + "/" + projectType?.value + '?isBuild=1');
  } else if(type == '3'){
    // evm 跳 多链部署详情页
    if(frameType?.value==1 && projectType?.value!='2'){
      router.push(`/projects/projectsDeploymentDetail?id=${record.projectId}&version=${record.version}&executeId=${record.id}`)
    }else if(projectType?.value=='2'){
      router.push(`/projects/${record.projectId}/${record.id}/workflows/${record.detailId}/${record.type}/${projectType?.value}`)
    }else{
      // 区分前端和node
      router.push("/projects/" + detailId.value + "/" + workflowId + "/workflows/" + workflowDetailId + "/" + type + "/" + projectType?.value + '?type=' + projectType.value);
    }
  }
}
const deleteWorkflow = (workflowId: string, workflowDetailId: string) => {
  delWorkflowId.value = workflowId;
  delWorkflowDetailId.value = workflowDetailId;
  delWorkflowModal.value = true;
}
const deleteWorkflowContent = async () => {
  try {
    loading.value = true;
    const data = await apiDeleteWorkflows(delWorkflowId.value, delWorkflowDetailId.value);
    message.success(data.message);
    getProjectsWorkflows();
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  } finally {
    delWorkflowModal.value = false;
    loading.value = false;
  }
}
const stopWorkflow = async (projectId: String, workflowId: number, detailId: number) => {
  try {
    const params = reactive({
      id: projectId,
      workflowsId: workflowId,
      workflowDetailId: detailId,
    })
    const data = await apiProjectsWorkflowsStop(params);
    message.success(data.message);
  } catch (error: any) {
    // console.log("error:", error)
    message.error(error.response.data.message);
  } finally {
    visibleModal.value = false;
  }
}

// watch(() => props.frameType,
//   (value) => {
//     if (props.projectType === '1') {
//       if (value === 4) {
//         actionList.value = [
//           { label: "All Action", value: "0" },
//           { label: "Build", value: "2" },
//         ]
//       } else {
//         actionList.value = [
//           { label: "All Action", value: "0" },
//           { label: "Check", value: "1" },
//           { label: "Build", value: "2" },
//         ]
//       }
//     } else {
//       actionList.value = [
//         { label: "All Action", value: "0" },
//         { label: "Check", value: "1" },
//         { label: "Build", value: "2" },
//         { label: "Deploy", value: "3" }
//       ]
//     }
//   }
// )

</script>
