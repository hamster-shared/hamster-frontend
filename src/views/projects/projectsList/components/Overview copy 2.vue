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
              <!-- <div v-if="viewInfo.frameType === 1">EVM</div>
              <div v-if="viewInfo.frameType === 4">StarkWare</div> -->
            </label>
            <label v-else-if="projectType === '2'">IPFS/Container</label>
          </div>
        </div>
      </div>
      <div>
        <label class="cursor-pointer group text-center w-[100px]"
          @click="projectsCheck(viewInfo.id, viewInfo.recentCheck.status, $event)">
          <lable v-if="projectType === '1' && viewInfo.frameType === 4">
            <img src="@/assets/icons/check.svg" class="h-[16px] dark:hidden cursor-default" />
            <img src="@/assets/icons/check-b.svg" class="h-[16px] hidden dark:inline-block cursor-default" />
          </lable>
          <label v-else>
            <img src="@/assets/icons/check.svg" class="h-[16px] dark:hidden group-hover:hidden" />
            <img src="@/assets/icons/check-b.svg" class="h-[16px] hidden dark:inline-block dark:group-hover:hidden" />
            <img src="@/assets/icons/check-color.svg" class="h-[16px] hidden group-hover:inline-block" />
          </label>

          <label class="group-hover:text-[#E2B578] ml-1 cursor-pointer"
            :class="projectType === '1' && viewInfo.frameType === 4 ? 'disabledCheckCss' : ''">Check</label>
        </label>
        <img src="@/assets/icons/line-slash.svg" class="h-[16px] mx-4 dark:hidden" />
        <img src="@/assets/icons/line-slash-b.svg" class="h-[16px] mx-4 hidden dark:inline-block" />
        <label class="cursor-pointer group text-center w-[100px]"
          @click="projectsBuild(viewInfo.id, viewInfo.recentBuild)">
          <img src="@/assets/icons/build.svg" class="h-[16px] dark:hidden group-hover:hidden" />
          <img src="@/assets/icons/build-b.svg" class="h-[16px] hidden dark:inline-block dark:group-hover:hidden" />
          <img src="@/assets/icons/build-color.svg" class="h-[16px] hidden group-hover:inline-block" />
          <label class="group-hover:text-[#E2B578] ml-1 cursor-pointer">Build</label>
        </label>
        <img src="@/assets/icons/line-slash.svg" class="h-[16px] mx-4 dark:hidden" />
        <img src="@/assets/icons/line-slash-b.svg" class="h-[16px] mx-4 hidden dark:inline-block" />
        <label class="cursor-pointer group"
          @click="projectsDeploy(viewInfo.id, viewInfo.recentBuild.version, viewInfo.recentBuild.status)">
          <img src="@/assets/icons/deploy.svg" class="h-[16px] dark:hidden group-hover:hidden" />
          <img src="@/assets/icons/deploy-b.svg" class="h-[16px] hidden dark:inline-block dark:group-hover:hidden" />
          <img src="@/assets/icons/deploy-color.svg" class="h-[16px] hidden group-hover:inline-block" />
          <label class="group-hover:text-[#E2B578] ml-1 cursor-pointer">Deploy</label>
        </label>
        <img src="@/assets/icons/line-slash.svg" class="h-[16px] mx-4 dark:hidden" />
        <img src="@/assets/icons/line-slash-b.svg" class="h-[16px] mx-4 hidden dark:inline-block" />
        <label class="cursor-pointer group text-center w-[100px]"
          @click="projectsOps(viewInfo.id, viewInfo.recentDeploy)">
          <img src="@/assets/icons/ops.svg" class="h-[16px] dark:hidden group-hover:hidden" />
          <img src="@/assets/icons/ops-b.svg" class="h-[16px] hidden dark:inline-block dark:group-hover:hidden" />
          <img src="@/assets/icons/ops-color.svg" class="h-[16px] hidden group-hover:inline-block" />
          <label class="group-hover:text-[#E2B578] ml-1 cursor-pointer">Ops</label>
        </label>
        <!-- <a-button type="primary" @click="projectsCheck(viewInfo.id,viewInfo.recentCheck.status)">Check</a-button>
        <a-button type="primary" class="ml-4" @click="projectsBuild(viewInfo.id,viewInfo.recentBuild.status)">Build</a-button>
        <a-button type="primary" class="ml-4" @click="projectsDeploy(viewInfo.id, viewInfo.recentBuild.version, viewInfo.recentBuild.status)">Deploy</a-button>
        <a-button type="primary" class="ml-4" @click="projectsOps(viewInfo.id, viewInfo.recentDeploy.version)">Ops</a-button> -->
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
            <img src="@/assets/icons/white-link.svg" class="h-[16px] mr-1 dark:hidden" />
            <img src="@/assets/icons/dark-link.svg" class="h-[16px] mr-1 hidden dark:inline-block" />
            main
          </div>
        </div>
        <div>
          <div class="text-[16px] font-bold">Recent Check</div>
          <div class="my-2" v-if="viewInfo.recentCheck.status === 0">No Data</div>
          <div class="flex items-center my-2" v-else-if="viewInfo.recentCheck.status === 1">
            <img src="@/assets/icons/running.svg" class="h-[16px] mr-1" />
            <div class="text-ellipsis">Running???{{ fromNowexecutionTime(viewInfo.recentCheck.startTime, "noThing") }}
            </div>
          </div>
          <div class="flex items-center my-2" v-else-if="viewInfo.recentCheck.status === 2">
            <img src="@/assets/icons/failed.svg" class="h-[16px] mr-1" />
            <div class="text-ellipsis">Failed???{{ fromNowexecutionTime(viewInfo.recentCheck.startTime, "noThing") }}
            </div>
          </div>
          <div class="flex items-center my-2 " v-else-if="viewInfo.recentCheck.status === 3">
            <img src="@/assets/icons/success.svg" class="h-[16px] mr-1" />
            <div class="text-ellipsis">Success???{{ fromNowexecutionTime(viewInfo.recentCheck.startTime, "noThing") }}
            </div>
          </div>
          <div class="my-2 text-ellipsis" v-else-if="viewInfo.recentCheck.status === 4">Stop???{{
            fromNowexecutionTime(viewInfo.recentCheck.startTime, "noThing")
          }}</div>
          <div class="text-[#E2B578] cursor-pointer"
            :class="projectType === '1' && viewInfo.frameType === 4 ? 'disabledCheckCss' : ''"
            @click="projectsCheck(viewInfo.id, viewInfo.recentCheck.status, $event)"
            v-if="viewInfo.recentCheck.status === 0">
            Check Now</div>
          <div class="text-[#E2B578] cursor-pointer"
            @click="goContractCheck(viewInfo.id, viewInfo.recentCheck.workflowId, viewInfo.recentCheck.id)"
            v-else-if="viewInfo.recentCheck.status === 1 || viewInfo.recentCheck.status === 4">View Process</div>
          <div class="text-[#E2B578] cursor-pointer"
            @click="goContractCheck(viewInfo.id, viewInfo.recentCheck.workflowId, viewInfo.recentCheck.id)" v-else>View
            Result</div>
        </div>
        <div>
          <div class="text-[16px] font-bold">Recent Build</div>
          <div class="my-2" v-if="viewInfo.recentBuild.status === 0">No Data</div>
          <div class="flex items-center my-2" v-else-if="viewInfo.recentBuild.status === 1">
            <img src="@/assets/icons/running.svg" class="h-[16px] mr-1" />
            <div class="text-ellipsis">Running???{{ fromNowexecutionTime(viewInfo.recentBuild.startTime, "noThing") }}
            </div>
          </div>
          <div class="flex items-center my-2" v-else-if="viewInfo.recentBuild.status === 2">
            <img src="@/assets/icons/failed.svg" class="h-[16px] mr-1" />
            <div class="text-ellipsis">Failed???{{ fromNowexecutionTime(viewInfo.recentBuild.startTime, "noThing") }}
            </div>
          </div>
          <div class="flex items-center my-2" v-else-if="viewInfo.recentBuild.status === 3">
            <img src="@/assets/icons/success.svg" class="h-[16px] mr-1" />
            <div class="text-ellipsis">Success???{{ fromNowexecutionTime(viewInfo.recentBuild.startTime, "noThing") }}
            </div>
          </div>
          <div class="my-2 text-ellipsis" v-else-if="viewInfo.recentBuild.status === 4">Stop???{{
            fromNowexecutionTime(viewInfo.recentBuild.startTime, "noThing")
          }}</div>
          <div class="text-[#E2B578] cursor-pointer" @click="projectsBuild(viewInfo.id, viewInfo.recentBuild)"
            v-if="viewInfo.recentBuild.status === 0">Build Now</div>
          <div class="text-[#E2B578] cursor-pointer"
            @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)"
            v-else-if="viewInfo.recentBuild.status === 1 || viewInfo.recentBuild.status === 4">View Process</div>
          <div class="text-[#E2B578] cursor-pointer"
            @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)"
            v-else-if="viewInfo.recentBuild.status === 2">View Result</div>
          <!-- <div class="text-[#E2B578] cursor-pointer"
            @click="goContractDeploy(viewInfo.id, viewInfo.recentBuild.version)" v-else>Deploy Now</div> -->
          <div v-else>
            <div v-if="projectType === '1'">
              <div class="text-[#E2B578] cursor-pointer"
                @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)">
                View Result
              </div>
            </div>
            <div class="text-[#E2B578] cursor-pointer"
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
                {{ '#'+ viewInfo.recentDeploy.version }}???
                {{ fromNowexecutionTime(viewInfo.recentDeploy.deployTime, "noThing") }}
              </div>
            </div>
            <div class="text-[#D3C9BC]" v-if="viewInfo.recentDeploy.version === ''">Explorer</div>
            <div v-else class="text-[#E2B578] cursor-pointer">
              <div v-if="deployTxHash && deployTxHash !== ''" @click="starknetVisible = true">View Process</div>
              <div v-else @click="goContractDetail(viewInfo.id, viewInfo.recentDeploy.version)">View Dashboard</div>
            </div>
          </div>
          <div v-else>
            <div class="my-2" v-if="viewInfo.recentDeploy.status === 0">No Data</div>
            <div class="flex items-center my-2" v-else-if="viewInfo.recentDeploy.status === 1">
              <img src="@/assets/icons/running.svg" class="h-[16px] mr-1" />
              <div class="text-ellipsis">Running???{{
                fromNowexecutionTime(viewInfo.recentDeploy.startTime, "noThing")
              }}
              </div>
            </div>
            <div class="flex items-center my-2" v-else-if="viewInfo.recentDeploy.status === 2">
              <img src="@/assets/icons/failed.svg" class="h-[16px] mr-1" />
              <div class="text-ellipsis">Failed???{{ fromNowexecutionTime(viewInfo.recentDeploy.startTime, "noThing") }}
              </div>
            </div>
            <div class="flex items-center my-2 " v-else-if="viewInfo.recentDeploy.status === 3">
              <img src="@/assets/icons/success.svg" class="h-[16px] mr-1" />
              <div class="text-ellipsis">Success???{{
                fromNowexecutionTime(viewInfo.recentDeploy.startTime, "noThing")
              }}
              </div>
            </div>
            <div class="my-2 text-ellipsis" v-else-if="viewInfo.recentDeploy.status === 4">Stop???{{
              fromNowexecutionTime(viewInfo.recentDeploy.startTime, "noThing")
            }}</div>
            <div class="text-[#D3C9BC]" v-if="viewInfo.recentDeploy.status === 0">Explorer</div>
            <div v-else class="text-[#E2B578] cursor-pointer"
              @click="goFrontEndDetail(viewInfo.id, viewInfo.recentDeploy)">
              View FrontEnd</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ContainerParam :containerVisible="containerVisible" @hideContainerParam="hideContainerParam" @frontendDeploying="frontendDeploying"></ContainerParam>
  <CustomMsg :showMsg="showMsg" :msgType="msgType" :msgParam="msgParam"></CustomMsg>
  <starkNetModal :starknetVisible="starknetVisible" :deployTxHash="deployTxHash" @cancelModal="starknetVisible = false">
  </starkNetModal>
</template>
<script lang='ts' setup>
import { ref, toRefs, computed, reactive } from 'vue';
import { useRouter } from "vue-router";
import { message } from 'ant-design-vue';
import { fromNowexecutionTime } from "@/utils/time/dateUtils.js";
import { apiProjectsCheck, apiProjectsBuild, apiProjectsDeploy } from "@/apis/projects";
import CustomMsg from '@/components/CustomMsg.vue';
import starkNetModal from '../../components/starkNetModal.vue';
import ContainerParam from './ContainerParam.vue';
import { useThemeStore } from "@/stores/useTheme";
import { ContractFrameTypeEnum } from "@/enums/frameTypeEnum.ts";

const theme = useThemeStore()

const router = useRouter();

const props = defineProps({
  viewType: String,
  viewInfo: Object,
  projectType: String,
});
const { viewType, viewInfo, projectType } = toRefs(props);
const showViewInfoRepositoryUrl = computed(() => {
  return viewInfo.value?.repositoryUrl.slice(0, 18) + '...' + viewInfo.value?.repositoryUrl.slice(-3, -1) + viewInfo.value?.repositoryUrl.slice(-1)
})

const emit = defineEmits(["loadProjects"]);
const containerVisible = ref(false);
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

const projectsCheck = async (id: String, status: Number, e: Event) => {
  if (props.projectType === '1' && props.viewInfo.frameType === 4) {
    e.stopPropagation()
  } else {
    disabled.value = false;
    try {
      if (status === 1) {
        message.info("Executing Now???please wait a moment.");
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

const projectsBuild = async (id: String, buildData: any) => {
  try {

    if (buildData.status === 1) {
      if(projectType?.value === "1") {
        message.info("Executing Now???please wait a moment.");
      } else {
        msgParam.value.workflowsId = buildData.workflowId;
        msgParam.value.workflowDetailId = buildData.id;
        msgType.value = 'build';
        setMsgShow();
      }
    } else {
      const res = await apiProjectsBuild(id);
      if(projectType?.value === "1") {
        message.success(res.message);
      } else {
        msgParam.value.workflowsId = buildData.workflowId;
        msgParam.value.workflowDetailId = buildData.id;
        msgType.value = 'build';
        setMsgShow();
      }

      loadView();
    }
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  } finally {
    // loading.value = false;
  }
};
const projectsDeploy = async (id: String, version: String, status: Number) => {
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
const projectsOps = async (id: String, recentDeploy: Object) => {
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
  //??????????????????
  emit("loadProjects");
};
const goContractCheck = async (id: String, workflowId: String, detailId: String) => {
  localStorage.setItem("projectName", viewInfo.value.name)
  localStorage.setItem("projectId", id)
  router.push("/projects/" + id + "/" + workflowId + "/workflows/" + detailId + "/1/" + projectType?.value);
};
const goContractBuild = async (id: String, workflowId: String, detailId: String) => {
  localStorage.setItem("projectName", viewInfo.value.name)
  localStorage.setItem("projectId", id)
  router.push("/projects/" + id + "/" + workflowId + "/workflows/" + detailId + "/2/" + projectType?.value);
};
const goContractDeploy = async (id: String, status: String | Number) => {
  if(localStorage.getItem('projectActiveKey') == '1'){
    localStorage.setItem("projectName", viewInfo.value.name)
    localStorage.setItem("projectId", id)
    router.push("/projects/" + id + "/artifacts-contract/" + status + "/deploy/00");
  } else if (localStorage.getItem('projectActiveKey') == '2'){
    if (status === 3) {
      goFrontendDeploy();
    }
  }
};

// const showStarknetVisible = (id: String) => {
//   // const starknetHashData: any = JSON.parse(localStorage.getItem('starknetHashData'));
//   // deployTxHash.value = starknetHashData[id].deployTxHash;
//   starknetVisible.value = true;
// };

const goContractDetail = async (id: String, version: String) => {
  localStorage.setItem("projectName", viewInfo.value.name)
  localStorage.setItem("projectId", id)
  router.push("/projects/" + id + "/contracts-details/" + version);
}
const goFrontendDeploy = async () => {
  try {
    if (viewInfo?.value.deployType === "2") { //Container?????????
      if (viewInfo?.value.recentDeploy.status === 3) {
        frontendDeploying();
      } else {
        containerVisible.value = true;
      }
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

const setMsgShow = () => {
  showMsg.value = true;
  setTimeout(function () {
    showMsg.value = false;
  }, 3000)

}

const goFrontEndDetail = (id: string, recentDeploy: Object) => {
  if (recentDeploy.status === 3) { //success
    router.push(`/projects/${recentDeploy.workflowId}/frontend-details/${recentDeploy.id}/${recentDeploy.packageId}`);
  } else {
    router.push(`/projects/${id}/${recentDeploy.workflowId}/workflows/${recentDeploy.id}/3/${projectType?.value}`);
  }
}
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

// .dark-css a,.dark-css a:hover{
//   color: #FFFFFF;
// }
a,
a:hover {
  color: #151210;
}

.text-ellipsis {
  text-overflow: ellipsis;
  /*????????????????????????????????????????????????*/
  white-space: nowrap;
  /*?????????????????????*/
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
</style>
