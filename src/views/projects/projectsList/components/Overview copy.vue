<template>
  <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[12px] p-[32px]">
    <div class="flex justify-between">
      <div class="mb-[32px] items-center">
        <div v-if="viewType === 'detail'" class="text-[24px]">Overview</div>
        <div v-else class="flex items-center">
          <div class="text-[24px] font-bold cursor-pointer hover:text-[#E2B578]"
            @click="goDetail(viewInfo.id, viewInfo.type)">{{ viewInfo.name }}</div>
          <div
            class="ml-4 text-[14px] rounded-[32px] py-1 px-4 border border-solid dark:border-[#434343] border-[#EBEBEB]">
            <label v-if="projectType === '1'">
              <div>{{ ContractFrameTypeEnum[viewInfo.frameType] }}</div>
            </label>
            <label v-else-if="projectType === '2'">FrontEnd</label>
          </div>
        </div>
      </div>

      <div>
        <label class="cursor-pointer group text-center w-[100px]" v-for="(item, index) in actionButtonList"
          @click="projectsAction(viewInfo, item, $event)">
          <label v-if="index !== 0">
            <img src="@/assets/icons/line-slash.svg" class="h-[16px] mx-4 dark:hidden" />
            <img src="@/assets/icons/line-slash-b.svg" class="h-[16px] mx-4 hidden dark:inline-block" />
          </label>
          <label v-if="projectType === '1' && viewInfo.frameType === 4 && item.name === 'Check'">
            <img src="@/assets/icons/check.svg" class="h-[16px] dark:hidden cursor-default" />
            <img src="@/assets/icons/check-b.svg" class="h-[16px] hidden dark:inline-block cursor-default" />
          </label>
          <label v-else>
            <img :src="getActionImageUrl(item.url[0])" class="h-[16px] cursor-default dark:hidden group-hover:hidden" />
            <img :src="getActionImageUrl(item.url[1])"
              class="h-[16px] hidden dark:inline-block dark:group-hover:hidden" />
            <img :src="getActionImageUrl(item.url[2])" class="h-[16px] hidden group-hover:inline-block" />
          </label>
          <label class="group-hover:text-[#E2B578] ml-1 cursor-pointer"
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
            <img src="@/assets/icons/white-link.svg" class="h-[16px] mr-1 dark:hidden" />
            <img src="@/assets/icons/dark-link.svg" class="h-[16px] mr-1 hidden dark:inline-block" />
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
          <div class="my-2" v-if="viewInfo.recentBuild.status === 0">{{ RecentStatusEnums[viewInfo.recentCheck.status] }}
          </div>
          <div v-else class="flex items-center my-2 ">
            <img :src="getImageUrl(viewInfo.recentBuild.status)" class="h-[16px] mr-1" />
            <div class="text-ellipsis">
              {{ RecentStatusEnums[viewInfo.recentBuild.status] }}｜{{
                fromNowexecutionTime(viewInfo.recentBuild.startTime, "noThing") }}
            </div>
          </div>

          <div class="text-[#E2B578] cursor-pointer" @click="projectsBuild(viewInfo.id, viewInfo.recentBuild.status)"
            v-if="viewInfo.recentBuild.status === 0">Build Now</div>

          <div class="text-[#E2B578] cursor-pointer"
            @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)"
            v-else-if="viewInfo.recentBuild.status === 1 || viewInfo.recentBuild.status === 4">View Process</div>
          <div class="text-[#E2B578] cursor-pointer"
            @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)"
            v-else-if="viewInfo.recentBuild.status === 2">View Result</div>

          <div v-else>
            <div v-if="projectType === '1'">
              <div class="text-[#E2B578] cursor-pointer"
                @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)">
                View Result
              </div>
            </div>
            <div class="text-[#E2B578] cursor-pointer" @click="goContractDeploy(viewInfo.id, viewInfo.recentBuild.status)"
              v-else>Deploy Now</div>
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
            <div v-else class="text-[#E2B578] cursor-pointer">
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
            <div v-else class="text-[#E2B578] cursor-pointer"
              @click="goFrontEndDetail(viewInfo.id, viewInfo.recentDeploy)">
              View FrontEnd</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CustomMsg :showMsg="showMsg" :msgParam="msgParam"></CustomMsg>
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
import { ContractFrameTypeEnum } from "@/enums/frameTypeEnum.ts";
import { RecentStatusEnums, SvgStatusEnums } from "../enums/RecentEnums";

const router = useRouter();

const props = defineProps({
  viewType: String,
  viewInfo: Object,
  projectType: String,
});

const actionButtonList = ref([
  { name: 'Check', url: ['check', 'check-b', 'check-color'] },
  { name: 'Build', url: ['build', 'build-b', 'build-color'] },
  { name: 'Deploy', url: ['deploy', 'deploy-b', 'deploy-color'] },
  { name: 'Ops', url: ['ops', 'ops-b', 'ops-color'] }])

const { viewType, viewInfo, projectType } = toRefs(props);
const showViewInfoRepositoryUrl = computed(() => {
  return viewInfo.value?.repositoryUrl.slice(0, 18) + '...' + viewInfo.value?.repositoryUrl.slice(-3, -1) + viewInfo.value?.repositoryUrl.slice(-1)
})

const emit = defineEmits(["loadProjects"]);
const disabled = ref(false);
const showMsg = ref(false);
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
      projectsBuild(val.id, val.recentBuild.status);
      break;
    case 'Deploy':
      projectsDeploy(val.id, val.recentDeploy.version, val.recentDeploy.status);
      break;
    case 'Ops':
      projectsOps(val.id, val);
      break;
    default: break;
  }
}

const projectsCheck = async (id: String, status: Number, e: Event) => {
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

const projectsBuild = async (id: String, status: Number) => {
  try {
    if (status === 1) {
      message.info("Executing Now，please wait a moment.");
    } else {
      const res = await apiProjectsBuild(id);
      message.success(res.message);
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
      goFrontendDeploy(id);
    } else {
      message.info("FrontEnd package not avaliable.");
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
  //重新查询数据
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
  if (localStorage.getItem('projectActiveKey') == '1') {
    localStorage.setItem("projectName", viewInfo.value.name)
    localStorage.setItem("projectId", id)
    router.push("/projects/" + id + "/artifacts-contract/" + status + "/deploy/00");
  } else if (localStorage.getItem('projectActiveKey') == '2') {
    if (status === 3) {
      goFrontendDeploy(id);
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
const goFrontendDeploy = async (id: String) => {
  try {
    const params = ref({
      id: id,
      workflowsId: viewInfo?.value.recentBuild.workflowId,
      workflowDetailId: viewInfo?.value.recentBuild.id,
    });
    const { data } = await apiProjectsDeploy(params.value);
    showMsg.value = true;
    msgParam.value.workflowsId = data.workflowId;
    msgParam.value.workflowDetailId = data.detailId;
    setTimeout(function () {
      showMsg.value = false;
    }, 3000)
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  }
}

const goFrontEndDetail = (id: string, recentDeploy: Object) => {
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
</style>
