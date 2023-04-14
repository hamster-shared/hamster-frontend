<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'"
    class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[12px] p-[32px]">
    <div class="flex justify-between">
      <div class="mb-[32px] items-center">
        <div v-if="viewType === 'detail'" class="text-[24px]">Overview</div>
        <div v-else class="flex items-center">
          <div class="project-title text-[24px] font-bold cursor-pointer hover:text-[#E2B578]"
            @click="goDetail(viewInfo.id, viewInfo.type)">{{ viewInfo.name }}</div>
          <div
            class="ml-4 text-[14px] rounded-[32px] py-1 px-4 border border-solid dark:border-[#434343] border-[#EBEBEB]">
            <label v-if="projectType === '1'">
              <div>{{ ContractFrameTypeEnum[viewInfo.frameType] }}</div>
            </label>
            <label v-else-if="projectType === '2'">{{ FrontEndDeployTypeEnum[viewInfo.deployType] }}</label>
          </div>
        </div>
      </div>


      <div>
        <label class="text-center w-[100px] action-button-item"
          v-for="(item, index) in actionButtonList">
          <label v-if="index !== 0">
            <svg-icon name="line-slash" size="16" class="mx-4" style="cursor: default;"/>
          </label>
          <label v-if="projectType === '1' && (viewInfo.frameType === 4 || viewInfo.frameType === 2) && item.name === 'Check'">
            <svg-icon name="check" size="14" />
          </label>
          <label v-else class="action-icon">
            <svg-icon :name="item.url" size="14" />
          </label>
          <label class="hover:text-[#E2B578] ml-1 cursor-pointer align-middle"
          @click="projectsAction(viewInfo, item.name, $event)"
            :class="projectType === '1' && viewInfo.frameType === 4 && item.name === 'Check' ? 'disabledCheckCss' : ''">
            {{ item.name }}
          </label>
        </label>
      </div>
    </div>


    <div class="p-[32px] dark:bg-[#36322D] rounded-[12px] border border-solid dark:border-[#434343] border-[#EBEBEB]">
      <div class="grid grid-cols-4 gap-4">
        <div>
          <div class="text-[16px] font-bold">Code Repository</div>
          <div class="my-2">
            <a target="_blank" :href="viewInfo.repositoryUrl">{{ showViewInfoRepositoryUrl }}</a>
          </div>
          <div>
            <svg-icon name="white-link" size="16" />
            main
          </div>
        </div>


        <div>
          <div class="text-[16px] font-bold">Recent Check</div>
          <div class="my-2" v-if="viewInfo.recentCheck.status === 0">{{ RecentStatusEnums[viewInfo.recentCheck.status] }}
          </div>
          <div v-else class="flex items-center my-2 ">
            <img :src="getImageUrl(viewInfo.recentCheck.status)" class="h-[16px] mr-1" />
            <div class="text-ellipsis">
              {{ RecentStatusEnums[viewInfo.recentCheck.status] }}｜{{
                fromNowexecutionTime(viewInfo.recentCheck.startTime, "noThing") }}
            </div>
          </div>

          <div class="text-[#E2B578] cursor-pointer inline-block"
            :class="projectType === '1' && viewInfo.frameType === 4 ? 'disabledCheckCss' : ''"
            @click="projectsCheck(viewInfo.id, viewInfo.recentCheck.status, $event)"
            v-if="viewInfo.recentCheck.status === 0">
            Check Now</div>
          <div class="text-[#E2B578] cursor-pointer inline-block"
            @click="goContractCheck(viewInfo.id, viewInfo.recentCheck.workflowId, viewInfo.recentCheck.id)"
            v-else-if="viewInfo.recentCheck.status === 1 || viewInfo.recentCheck.status === 4">View Process</div>
          <div class="text-[#E2B578] cursor-pointer inline-block"
            @click="goContractCheck(viewInfo.id, viewInfo.recentCheck.workflowId, viewInfo.recentCheck.id)" v-else>View
            Result</div>
        </div>


        <div>
          <div class="text-[16px] font-bold">Recent Build</div>
          <div class="my-2" v-if="viewInfo.recentBuild.status === 0">{{ RecentStatusEnums[viewInfo.recentBuild.status] }}
          </div>
          <div v-else class="flex items-center my-2 ">
            <img :src="getImageUrl(viewInfo.recentBuild.status)" class="h-[16px] mr-1" />
            <div class="text-ellipsis">
              {{ RecentStatusEnums[viewInfo.recentBuild.status] }}｜{{
                fromNowexecutionTime(viewInfo.recentBuild.startTime, "noThing") }}
            </div>
          </div>


          <div class="text-[#E2B578] cursor-pointer inline-block"
            @click="projectsBuild(viewInfo.id, viewInfo.recentBuild, viewInfo.frameType,viewInfo.type)" v-if="viewInfo.recentBuild.status === 0">Build Now
          </div>
          <div class="text-[#E2B578] cursor-pointer inline-block"
            @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)"
            v-else-if="viewInfo.recentBuild.status === 1 || viewInfo.recentBuild.status === 4">View Process</div>
          <div class="text-[#E2B578] cursor-pointer inline-block"
            @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)"
            v-else-if="viewInfo.recentBuild.status === 2">View Result</div>
          <div v-else>
            <div v-if="projectType === '1'">
              <div class="text-[#E2B578] cursor-pointer inline-block"
                @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)">
                View Result
              </div>
            </div>
            <div class="text-[#E2B578] cursor-pointer inline-block"
              @click="goContractDeploy(viewInfo.id, viewInfo.recentBuild.status)" v-else>Deploy Now</div>
          </div>
        </div>


        <div>
          <div class="text-[16px] font-bold">Recent Deploy</div>
          <div v-if="projectType === '1'">
            <div class="my-2" v-if="viewInfo.recentDeploy.version === ''">No Data</div>
            <div class="flex items-center my-2" v-else>
              <div v-if="viewInfo.recentDeploy.status === 1">Deploying |
                {{ fromNowexecutionTime(viewInfo.recentDeploy.deployTime, "noThing") }}
              </div>
              <div v-else>
                <img src="@/assets/icons/success.svg" class="h-[16px] mr-1" />
                {{ '#' + viewInfo.recentDeploy.version }}｜
                {{ fromNowexecutionTime(viewInfo.recentDeploy.deployTime, "noThing") }}
              </div>
            </div>
            <div class="text-[#D3C9BC]" v-if="viewInfo.recentDeploy.version === ''">Explorer</div>
            <div v-else class="text-[#E2B578] cursor-pointer inline-block">
              <div v-if="deployTxHash && deployTxHash !== ''" @click="starknetVisible = true">View Process</div>
              <div v-else @click="goContractDetail(viewInfo.id, viewInfo.recentDeploy.version)">View Dashboard</div>
            </div>
          </div>
          <div v-else>
            <div class="my-2" v-if="viewInfo.recentDeploy.status === 0">{{ RecentStatusEnums[viewInfo.recentDeploy.status]
            }}</div>
            <div v-else class="flex items-center my-2 ">
              <img :src="getImageUrl(viewInfo.recentDeploy.status)" class="h-[16px] mr-1" />
              <div class="text-ellipsis">
                {{ RecentStatusEnums[viewInfo.recentDeploy.status] }}｜{{
                  fromNowexecutionTime(viewInfo.recentDeploy.startTime, "noThing") }}
              </div>
            </div>
            <div class="text-[#D3C9BC]" v-if="viewInfo.recentDeploy.status === 0">Explorer</div>
            <div v-else class="text-[#E2B578] cursor-pointer inline-block"
              @click="goFrontEndDetail(viewInfo.id, viewInfo.recentDeploy)">
              View FrontEnd</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ContainerParam :containerVisible="containerVisible" :detailId="viewInfo?.id" @hideContainerParam="hideContainerParam"
    @frontendContainerDeploy="frontendContainerDeploy"></ContainerParam>
  <CustomMsg :showMsg="showMsg" :msgType="msgType" :msgParam="msgParam">
  </CustomMsg>
  <starkNetModal :starknetVisible="starknetVisible" :deployTxHash="deployTxHash" @cancelModal="starknetVisible = false">
  </starkNetModal>
  <AptosBuildParams :aptosBuildVisible="aptosBuildVisible" :detailId="viewInfo?.id" :aptosBuildParams="aptosBuildParams" @hideAptosBuildVisible="hideAptosBuildVisible" @aptosBuild="aptosBuild"/>
</template>
<script lang='ts' setup>
import { ref, toRefs, computed, reactive } from 'vue';
import { useRouter } from "vue-router";
import { message } from 'ant-design-vue';
import { fromNowexecutionTime } from "@/utils/time/dateUtils.js";
import { apiProjectsCheck, apiProjectsBuild, apiProjectsDeploy, apiContainerCheck, apiProjectsContainerDeploy, apiCheckSetAptosBuildParams, apiGetAptosBuildParams, apiAptosBuild } from "@/apis/projects";
import CustomMsg from '@/components/CustomMsg.vue';
import starkNetModal from '../../components/starkNetModal.vue';
import ContainerParam from './ContainerParam.vue';
import AptosBuildParams from './AptosBuildParams.vue'
import { useThemeStore } from "@/stores/useTheme";
import { ContractFrameTypeEnum, FrontEndDeployTypeEnum } from "@/enums/frameTypeEnum";
import { RecentStatusEnums, SvgStatusEnums } from "../enums/RecentEnums";
import type { ViewInfoItem, RecentDeployItem } from "@/views/projects/components/data";

const theme = useThemeStore()

const router = useRouter();

const props = defineProps<{
  viewType: string,
  projectType: string,
  viewInfo: ViewInfoItem,
}>()

const actionButtonList = ref([
  { name: 'Check', url: 'check' },
  { name: 'Build', url: 'build' },
  { name: 'Deploy', url: 'deploy' },
  { name: 'Ops', url: 'ops' }]);

const { viewType, viewInfo, projectType } = toRefs(props);
const showViewInfoRepositoryUrl = computed(() => {
  return viewInfo.value?.repositoryUrl.slice(0, 18) + '...' + viewInfo.value?.repositoryUrl.slice(-3, -1) + viewInfo.value?.repositoryUrl.slice(-1)
})
const emit = defineEmits(["loadProjects"]);
const containerVisible = ref(false);
const aptosBuildVisible = ref(false)
const disabled = ref(false);
const showMsg = ref(false);
const msgType = ref("");
const msgParam = ref({
  id: viewInfo?.value.id,
  workflowsId: viewInfo?.value.recentDeploy.workflowId,
  workflowDetailId: viewInfo?.value.recentDeploy.id,
  projectType: projectType?.value
});

const starknetVisible = ref(false);
const starknetHashData = JSON.parse(localStorage.getItem('starknetHashData')) || reactive({});
// console.log(starknetHashData, 'starknetHashData')
const deployTxHash = starknetHashData[props.viewInfo.id]?.deployTxHash || '';
// console.log('deployTxHash', props.viewInfo.id, deployTxHash)

const goDetail = (id: string, type: string) => {
  localStorage.setItem("projectName", viewInfo.value.name)
  localStorage.setItem("projectId", id)
  router.push("/projects/" + id + "/details/" + type);
}

const projectsAction = (val: any, type: string, e: Event) => {
  switch (type) {
    case 'Check':
      projectsCheck(val.id, val.recentCheck.status, e);
      break;
    case 'Build':
      projectsBuild(val.id, val.recentBuild, val.frameType,val.type);
      break;
    case 'Deploy':
      projectsDeploy(val.id, val.recentBuild.version, val.recentBuild.status);
      break;
    case 'Ops':
      projectsOps(val.id, val.recentDeploy);
      break;
    default: break;
  }
}

const projectsCheck = async (id: string, status: Number, e: Event) => {
  if (props.projectType === '1' && props.viewInfo.frameType === 4) {
    e.stopPropagation()
  } else {
    disabled.value = false;
    try {
      if (status === 1) {
        message.info("Executing Now，please wait a moment.");
      } else {
        const res = await apiProjectsCheck(id);
        message.success(res.message);
        loadView();
      }
    } catch (error: any) {
      console.log("erro:", error)
      message.error(error.response.data.message);
    } finally {
      // loading.value = false;
    }
  }

};

const buildStatusAction = async (id: string, buildData: any) => {
  if (buildData.status === 1) {
    if (projectType?.value === "1") {
      message.info("Executing Now，please wait a moment.");
    } else {
      msgParam.value.workflowsId = buildData.workflowId;
      msgParam.value.workflowDetailId = buildData.id;
      msgType.value = 'build';
      setMsgShow();
    }
  } else {
    const res = await apiProjectsBuild(id);
    if (projectType?.value === "1") {
      message.success(res.message);
    } else {
      msgParam.value.workflowsId = res.workflowId;
      msgParam.value.workflowDetailId = res.detailId;
      msgType.value = 'build';
      setMsgShow();
    }
    loadView();
  }
}

const aptosBuildParams = ref([])
const projectsBuild = async (id: string, buildData: any, frameType: string,type:any) => {
  console.log('projectsBuild:::', id, buildData, frameType)
  const res = await apiCheckSetAptosBuildParams(id)
  const needsParams = res.data.needsParams
  try {
    if (frameType == '2' && type == 1 && needsParams) {
      aptosBuildVisible.value = true
      const { data } = await apiGetAptosBuildParams(id)
      console.log('apiGetAptosBuildParams:::', data)
      aptosBuildParams.value = data
    }else if (frameType == '2' && type == 1 && !needsParams){
      if (buildData.status == 1){
        message.info("Executing Now，please wait a moment.");
      } else {
        const { data } = await apiAptosBuild(id)
        msgParam.value.workflowsId = data.workflowId;
        msgParam.value.workflowDetailId = data.id;
        msgType.value = 'build';
        setMsgShow();

        loadView();
      }
    }else {
      buildStatusAction(id, buildData)
    }

  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  } finally {
    // loading.value = false;
  }
};
const projectsDeploy = async (id: string, version: string, status: Number) => {
  if (projectType?.value === '1') {
    if (status === 0 || status === 1 || version === "") {
      message.info("Smart contract not avaliable.");
    } else {
      goContractDeploy(id, version);
    }
  } else {
    if (status === 3) {
      goFrontendDeploy();
    } else {
      message.info("FrontEnd image not avaliable");
    }
  }
};
const projectsOps = async (id: string, recentDeploy: RecentDeployItem) => {
  if (projectType?.value === "1") {
    if (recentDeploy.version === "") {
      message.info("Smart contract not avaliable.");
    } else {
      goContractDetail(id, recentDeploy.version);
    }
  } else {
    router.push("/projects/" + recentDeploy.workflowId + "/frontend-details/" + recentDeploy.id + "/" + recentDeploy.packageId);
  }
};
const loadView = async () => {
  //重新查询数据
  emit("loadProjects");
};
const goContractCheck = async (id: string, workflowId: string, detailId: string) => {
  localStorage.setItem("projectName", viewInfo.value.name)
  localStorage.setItem("projectId", id)
  router.push("/projects/" + id + "/" + workflowId + "/workflows/" + detailId + "/1/" + projectType?.value);
};
const goContractBuild = async (id: string, workflowId: string, detailId: string) => {
  localStorage.setItem("projectName", viewInfo.value.name)
  localStorage.setItem("projectId", id)
  router.push("/projects/" + id + "/" + workflowId + "/workflows/" + detailId + "/2/" + projectType?.value);
};
const goContractDeploy = async (id: string, status: string | Number) => {
  if (localStorage.getItem('projectActiveKey') == '1') {
    localStorage.setItem("projectName", viewInfo.value.name)
    localStorage.setItem("projectId", id)
    router.push("/projects/" + id + "/artifacts-contract/" + status + "/deploy/00");
  } else if (localStorage.getItem('projectActiveKey') == '2') {
    if (status === 3) {
      goFrontendDeploy();
    }
  }
};

// const showStarknetVisible = (id: string) => {
//   // const starknetHashData: any = JSON.parse(localStorage.getItem('starknetHashData'));
//   // deployTxHash.value = starknetHashData[id].deployTxHash;
//   starknetVisible.value = true;
// };

const goContractDetail = async (id: string, version: string) => {
  localStorage.setItem("projectName", viewInfo.value.name)
  localStorage.setItem("projectId", id)
  router.push("/projects/" + id + "/contracts-details/" + version);
}
const goFrontendDeploy = async () => {
  try {
    if (viewInfo?.value.deployType === 2) { //Container的场合
      frontendContainerCheck();
    } else {
      frontendDeploying();
    }
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  }
}
const hideContainerParam = () => {
  containerVisible.value = false;
}

const frontendDeploying = async () => {
  try {
    const params = ref({
      id: viewInfo?.value.id,
      workflowsId: viewInfo?.value.recentBuild.workflowId,
      workflowDetailId: viewInfo?.value.recentBuild.id,
    });
    const { data } = await apiProjectsDeploy(params.value);
    msgParam.value.workflowsId = data.workflowId;
    msgParam.value.workflowDetailId = data.detailId;
    msgType.value = 'deploy';
    setMsgShow();

    loadView();
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  }
}

const hideAptosBuildVisible = () => {
  aptosBuildVisible.value = false
}
const aptosBuild = async(id:any)=>{
  try {
    const { data } = await apiAptosBuild(id.value)
    console.log('aptosbuild::', data)
    msgParam.value.workflowsId = data.workflowId;
    msgParam.value.workflowDetailId = data.detailId;
    msgType.value = 'build';
    setMsgShow();

    loadView();
  } catch (err: any) {
    console.log('err:', err)
  }
}

const frontendContainerDeploy = async (apiContainerDeployParams?: Object) => {
  try {
    const params = ref({
      id: viewInfo?.value.id,
      workflowsId: viewInfo?.value.recentBuild.workflowId,
      workflowDetailId: viewInfo?.value.recentBuild.id,
    });
    const { data } = await apiProjectsContainerDeploy(params.value, apiContainerDeployParams);

    msgParam.value.workflowsId = data.workflowId;
    msgParam.value.workflowDetailId = data.detailId;
    msgType.value = 'deploy';
    setMsgShow();

    loadView();
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  }
}

const frontendContainerCheck = async () => {
  try {
    const { data } = await apiContainerCheck(viewInfo?.value.id, viewInfo?.value.recentBuild.workflowId);
    if (data === false) { //未配置
      containerVisible.value = true;
    } else {
      frontendContainerDeploy();
    }
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  }
}

const setMsgShow = () => {
  showMsg.value = true;
  setTimeout(function () {
    showMsg.value = false;
  }, 3000)

}

const goFrontEndDetail = (id: string, recentDeploy: RecentDeployItem) => {
  if (recentDeploy.status === 3) { //success
    router.push(`/projects/${recentDeploy.workflowId}/frontend-details/${recentDeploy.id}/${recentDeploy.packageId}`);
  } else {
    router.push(`/projects/${id}/${recentDeploy.workflowId}/workflows/${recentDeploy.id}/3/${projectType?.value}`);
  }
}

const getActionImageUrl = (status: any) => {
  return new URL(`../../../../assets/icons/${status}.svg`, import.meta.url)
    .href;
}


const getImageUrl = (status: any) => {
  let iconName = `${SvgStatusEnums[status]}`;
  return new URL(`../../../../assets/icons/${iconName}.svg`, import.meta.url)
    .href;
};
</script>
<style lang='less' scoped>
@baseColor: #E2B578;

html[data-theme='dark'] {

  a,
  a:hover {
    color: #FFFFFF;
  }

  .disabledCheckCss {
    color: #E0DBD2;
    cursor: default;
  }

  .disabledCheckCss:hover {
    color: #E0DBD2;
  }
}


:deep(.ant-btn) {
  border-radius: 8px;
}

:deep(.ant-btn-primary) {
  width: 120px;
  height: 40px;
}

:deep(.ant-btn-primary),
:deep(.ant-btn-primary:hover),
:deep(.ant-btn-primary:focus) {
  border-color: @baseColor;
  background: @baseColor;
}

a,
a:hover {
  color: #151210;
}

.text-ellipsis {
  text-overflow: ellipsis;
  /*文字溢出的部分隐藏并用省略号代替*/
  white-space: nowrap;
  /*文本不自动换行*/
  overflow: hidden;
}

html[data-theme='light'] {
  .disabledCheckCss {
    color: #151210;
    cursor: default;
  }

  .disabledCheckCss:hover {
    color: #151210;
  }
}

.action-button-item:hover {
  .action-icon {
    .svg-icon {
      color: #E2B578;
    }
  }


}
</style>
