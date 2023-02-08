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
        <div class="ml-4 text-[14px] rounded-[32px] py-1 px-4 border border-solid dark:border-[#434343] border-[#EBEBEB]">
          <label v-if="projectType === '1'">Contract</label>
          <label v-else-if="projectType === '2'">FrontEnd</label>
        </div>
      </div>
      <div>
       <a-button type="primary" ghost @click="deleteModal = true;">Delete</a-button>
       <a-button type="primary" class="ml-4" @click="visibleModal = true">Setting</a-button>
      </div>
    </div>
    <div v-if="Object.keys(projectsDetail).length!==0">
      <Overview :viewType="viewType" :projectType="projectType" :viewInfo="projectsDetail"  @loadProjects="loadProjects" />
    </div>
    <Workflows :detailId="detailId" :projectType="projectType" />
    <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[12px] py-[24px] px-[32px]">
      <div class="flex mb-2 items-center text-[24px] font-bold">Artifacts</div>
      <a-tabs v-model:activeKey="activeKey" @tabClick="handleTabClick">
        <a-tab-pane v-if="params.type === '1'" key="1" tab="Contract">
          <Contract ref="contractRef" :detailId="detailId"  />
        </a-tab-pane>
        <a-tab-pane v-if="params.type === '2'" key="2" tab="Package">
          <Package ref="packageRef" pageType="project" :detailId="detailId"  />
        </a-tab-pane>
        <a-tab-pane key="3" tab="Report">
          <Report ref="reportRef" :detailId="detailId" :projectType="projectType"  />
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
</template>
<script lang='ts' setup>
import { reactive, ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import Overview from "../projectsList/components/Overview.vue";
import Workflows from "./components/Workflows.vue";
import Contract from "./components/Contract.vue";
import Report from "./components/Report.vue";
import Package from "./components/Package.vue";
import {
  apiGetProjectsDetail,
  apiUpdateProjectsName,
  apiDeleteProjects,
  apiDupProjectName
} from "@/apis/projects";
import { message } from "ant-design-vue";
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore()

const router = useRouter();
const { params } = useRoute();
const timer = ref();
const projectType = ref(params.type);
const activeKey = ref(params.type);
const loading = ref(false)
const detailId = ref(params.id);
const viewType = ref("detail");
const visibleModal = ref(false);
const deleteModal = ref(false);
const contractRef = ref();
const reportRef = ref();
const packageRef = ref();
const formRef = ref();
const userInfo = localStorage.getItem('userInfo');
const formData = reactive({
  name: '',
  userId: JSON.parse(userInfo)?.id,
});
const projectsDetail = ref({});

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

onMounted(() => {
  getProjectsDetail();
})

onBeforeUnmount(() => {
  clearTimeout(timer.value);
})

const loadProjects = () => {
  getProjectsDetail();
}

const handleTabClick = (tab: any) => {
  setTimeout(function () {
    if (tab === "1") {
      contractRef.value.getProjectsContract();
      
    } else if (tab === "2") {
        packageRef.value.getProjectsPackage();
      
    } else if (tab === "3") {
        reportRef.value.getProjectsReports();
    }
  }, 1)
  
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
        
        if (activeKey.value === "1") {
          contractRef.value.getProjectsContract();
          
        } else if (activeKey.value === "2") {
            packageRef.value.getProjectsPackage();
          
        } else if (activeKey.value === "3") {
            reportRef.value.getProjectsReports();
        }
      }
    }
    const recentStatus = {
      checkStatus: data.recentCheck.status,
      buildStatus: data.recentBuild.status,
    }
    window.localStorage.setItem("recentStatus"+data.name, JSON.stringify(recentStatus));

    localStorage.setItem("projectName", data.name)
    localStorage.setItem("projectId", data.id)
    if (projectType.value === '1' && (data.recentCheck.status === 1 || data.recentBuild.status === 1)
      || projectType.value === '2' && (data.recentCheck.status === 1 || data.recentBuild.status === 1 || data.recentDeploy.status === 1)) {
      
      timer.value = setTimeout(() => {
        //需要定时执行的代码
        getProjectsDetail();
      }, 5000)
    } else {
      clearTimeout(timer.value);
    }
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
