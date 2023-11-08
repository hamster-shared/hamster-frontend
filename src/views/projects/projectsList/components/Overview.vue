<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'"
    class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[12px] p-[32px]">
    <div class="flex justify-between">
      <div class="first">
        <div v-if="viewType === 'detail'" class="text-[24px]">Overview</div>
        <div v-else class="flex items-center">
          <div class="project-title text-[24px] font-bold cursor-pointer hover:open-link-css"
            @click="goDetail(viewInfo.id, viewInfo.type)">{{ viewInfo.name }}</div>
          <div
            class="ml-4 text-[14px] rounded-[32px] py-1 px-4 border border-solid dark:border-[#434343] border-[#EBEBEB]">
            <label v-if="projectType === '1'">
              <div>{{ ContractFrameTypeEnum[viewInfo.frameType] }}</div>
            </label>
            <label v-else-if="projectType === '2'">{{ FrontEndDeployTypeEnum[viewInfo.deployType] }}</label>
            <!-- <label v-else-if="projectType === '2'">IC</label> -->
            <label v-else-if="projectType === '3' && viewInfo.frameType == 1">Polkadot</label>
          </div>
          <!-- 这里 -->
          <div v-if="viewInfo.labelDisplay"
            class="ml-4 text-[14px] rounded-[32px] py-1 px-4 border border-solid dark:border-[#434343] border-[#EBEBEB]">
            <label>{{ viewInfo.labelDisplay }}</label>
          </div>
        </div>
        <!-- </div> -->

        <div class="label-button">
          <!-- <label class="cursor-pointer group text-center w-[50px] action-button-item" v-for="(item, index) in actionButtonList" @click="projectsAction(viewInfo, item.name, $event)"> -->
          <!-- <label v-if="index !== 0">
            <svg-icon name="line-slash" size="15" />
          </label> -->
          <!-- </label> -->
          <div>

            <label class="text-center w-[100px] " v-for="(item, index) in actionButtonList">
              <!-- 按钮 -->
              <label v-if="index !== 0">
                <svg-icon name="line-slash" size="16" class="mx-4" style="cursor: default;" />
              </label>
              <!-- <label v-if="projectType === '1' && (viewInfo.frameType === 4 || viewInfo.frameType === 2) && item.name === 'Check'" class="mx-[4px]">
            <svg-icon name="check" size="13" />
          </label> -->
              <label
                :class="[checkCondition() && item.name == 'Check' || opsCondition() && item.name === 'Ops' ? 'action-button-disabled' : 'action-button-item']">
                <label class="action-icon mx-[8px]">
                  <svg-icon :name="item.url" size="15"
                    :style="{ cursor: checkCondition() && item.name == 'Check' || opsCondition() && item.name === 'Ops' ? 'default' : 'cursor' }" />
                </label>
                <!-- 按钮 -->
                <!-- <label class="group-hover:text-[#E2B578] ml-1 align-middle" @click="check"></label> -->
                <!-- <label class="ml-1 align-middle cursor-pointer" @click="projectsAction(viewInfo, item.name, $event)" :class="projectType === '1' && viewInfo.frameType === 4 && item.name === 'Check' ? 'disabledCheckCss' : ''"> -->
                <label
                  :style="{ cursor: checkCondition() && item.name == 'Check' || opsCondition() && item.name === 'Ops' ? 'default' : 'cursor' }"
                  class="ml-1 align-middle cursor-pointer hover:open-link-css"
                  @click="projectsAction(viewInfo, item.name, $event)">
                  {{ item.name }}
                </label>
              </label>
            </label>
          </div>
        </div>

      </div>
      <div class="center">
        <div class="grid grid-cols-4 gap-4">
          <div>
            <div class="text-[16px] font-bold">Code Repository</div>

            <div class="my-2">
              <a target="_blank" :href="viewInfo.repositoryUrl" class="flex">
                <div class="text-over-css">{{ showViewInfoRepositoryUrlStart }}</div>
                <div>{{ showViewInfoRepositoryUrl + '/' + viewInfo.branch }}</div>
              </a>
            </div>
            <div v-if="projectType === '1'">
              <div>
                <div class="inline-block cursor-pointer open-link-css" @click="openInChainIDE(viewInfo)">
                  <span>Open with ChainIDE</span>
                </div>
              </div>
            </div>
            <div v-else>
              <div>
                <svg-icon name="white-link" size="16" />
                main
              </div>
            </div>
          </div>


          <div>
            <div class="text-[16px] font-bold">Recent Check</div>
            <div class="my-2" v-if="viewInfo.recentCheck.status === 0">{{ RecentStatusEnums[viewInfo.recentCheck.status]
            }}
            </div>
            <div v-else class="flex items-center my-2 ">
              <img :src="getImageUrl(viewInfo.recentCheck.status)" class="h-[16px] mr-1" />
              <div class="text-ellipsis">
                {{ RecentStatusEnums[viewInfo.recentCheck.status] }}｜{{
                  fromNowexecutionTime(viewInfo.recentCheck.startTime, "noThing") }}
              </div>
            </div>

            <!-- <div class="text-[#E2B578] cursor-pointer inline-block"
            :class="projectType === '1' && viewInfo.frameType === 4 ? 'disabledCheckCss' : ''"
            @click="projectsCheck(viewInfo.id, viewInfo.recentCheck.status, $event)">
            Check Now
          </div> -->
            <div v-if="projectType === '3'">Check Now</div>
            <div v-else>
              <div class="inline-block cursor-pointer"
                :class="[checkCondition() ? 'action-button-disabled' : 'open-link-css']"
                @click="projectsCheck(viewInfo.id, viewInfo.recentCheck.status, $event)"
                :style="{ cursor: checkCondition() ? 'default' : 'cursor' }" v-if="viewInfo.recentCheck.status === 0">
                <span>Check Now</span>
              </div>
              <div class="inline-block cursor-pointer open-link-css"
                @click="goContractCheck(viewInfo.id, viewInfo.recentCheck.workflowId, viewInfo.recentCheck.id)"
                v-else-if="viewInfo.recentCheck.status === 1 || viewInfo.recentCheck.status === 4">View Process</div>
              <div class="inline-block cursor-pointer open-link-css"
                @click="goContractCheck(viewInfo.id, viewInfo.recentCheck.workflowId, viewInfo.recentCheck.id)" v-else>
                View Now
              </div>
            </div>
          </div>

          <div>
            <div class="text-[16px] font-bold">Recent Build</div>
            <div class="my-2" v-if="viewInfo.recentBuild.status === 0">{{ RecentStatusEnums[viewInfo.recentBuild.status]
            }}</div>
            <div v-else class="flex items-center my-2 ">
              <img :src="getImageUrl(viewInfo.recentBuild.status)" class="h-[16px] mr-1" />
              <div class="text-ellipsis">
                {{ RecentStatusEnums[viewInfo.recentBuild.status] }}｜{{
                  fromNowexecutionTime(viewInfo.recentBuild.startTime, "noThing") }}
              </div>
            </div>

            <div class="inline-block cursor-pointer open-link-css"
              @click="projectsBuild(viewInfo.id, viewInfo.recentBuild, viewInfo.frameType, viewInfo.type)"
              v-if="viewInfo.recentBuild.status === 0">Build Now
            </div>
            <div class="inline-block cursor-pointer open-link-css"
              @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)"
              v-else-if="viewInfo.recentBuild.status === 1 || viewInfo.recentBuild.status === 4">View Process</div>
            <!-- <div class="inline-block cursor-pointer open-link-css"
            @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)"
            v-else-if="viewInfo.recentBuild.status === 2">
            View Now
            </div> -->
            <div v-else>
              <div v-if="projectType === '1' && viewInfo.frameType !== 7">
                <div class="inline-block cursor-pointer open-link-css"
                  @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)">
                  View Now
                </div>
              </div>
              <div v-else-if="projectType === '2'">
                <div v-if="viewInfo.recentBuild.status === 3" class="inline-block cursor-pointer open-link-css"
                  @click="goContractDeploy(viewInfo.id, viewInfo.recentBuild.status)">
                  Deploy Now
                </div>
                <div v-else-if="viewInfo.recentBuild.status === 2" class="inline-block cursor-pointer open-link-css"
                  @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)">
                  View Now
                </div>
              </div>
              <div v-else-if="projectType === '3' || projectType === '1' && viewInfo.frameType === 7">
                <div class="inline-block cursor-pointer open-link-css"
                  @click="goContractBuild(viewInfo.id, viewInfo.recentBuild.workflowId, viewInfo.recentBuild.id)">
                  View Result
                </div>
              </div>
            </div>
          </div>


          <div>
            <div class="text-[16px] font-bold">Recent Deploy</div>
            <div v-if="projectType === '1'">
              <div class="my-2"
                v-if="viewInfo.recentDeploy.version === '' && viewInfo.frameType != 7 || viewInfo.frameType === 7 && viewInfo.recentDeploy.status === 0">
                No Data</div>
              <div class="flex items-center my-2" v-else>
                <div v-if="viewInfo.recentDeploy.status === 1">
                  <div v-if="viewInfo.frameType === 7">
                    <div class="flex items-center">
                      <img :src="getImageUrl(viewInfo.recentDeploy.status)" class="h-[16px] mr-1" />
                      <div class="text-ellipsis">
                        {{ RecentStatusEnums[viewInfo.recentDeploy.status] }}｜{{
                          fromNowexecutionTime(viewInfo.recentDeploy.startTime, "noThing") }}
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    Deploying | {{ fromNowexecutionTime(viewInfo.recentDeploy.deployTime, "noThing") }}
                  </div>
                </div>
                <div v-else>
                  <img src="@/assets/icons/success.svg" class="h-[16px] mr-1" />
                  {{ '#' + viewInfo.recentDeploy.version }}｜
                  {{ fromNowexecutionTime(viewInfo.recentDeploy.deployTime, "noThing") }}
                </div>
              </div>

              <div class="text-[#D3C9BC]"
                v-if="viewInfo.recentDeploy.version === '' && viewInfo.frameType != 7 || viewInfo.frameType === 7 && viewInfo.recentDeploy.status === 0">
                Explorer</div>
              <div v-else class="inline-block cursor-pointer open-link-css">
                <div v-if="deployTxHash && deployTxHash !== ''" @click="starknetVisible = true">View Process</div>
                <div v-else @click="goContractDetail(viewInfo.id, viewInfo.recentDeploy.version)">View Dashboard</div>
              </div>
            </div>
            <div v-else>
              <div class="my-2" v-if="viewInfo.recentDeploy.status === 0">{{
                RecentStatusEnums[viewInfo.recentDeploy.status]
              }}</div>
              <div v-else class="flex items-center my-2 ">
                <img :src="getImageUrl(viewInfo.recentDeploy.status)" class="h-[16px] mr-1" />
                <div class="text-ellipsis">
                  {{ RecentStatusEnums[viewInfo.recentDeploy.status] }}｜{{
                    fromNowexecutionTime(viewInfo.recentDeploy.startTime, "noThing") }}
                </div>
              </div>

              <div class="text-[#D3C9BC]" v-if="viewInfo.recentDeploy.status === 0">Explorer</div>
              <div v-else>
                <div v-if="projectType === '2'">
                  <div class="inline-block cursor-pointer open-link-css"
                    @click="goFrontEndDetail(viewInfo.id, viewInfo.recentDeploy)">
                    View FrontEnd
                  </div>
                </div>
                <div v-else-if="projectType === '3'">
                  <div class="inline-block cursor-pointer open-link-css"
                    @click="goFrontEndDetail(viewInfo.id, viewInfo.recentDeploy)"
                    v-if="viewInfo.recentDeploy.status === 1 || viewInfo.recentDeploy.status === 4">
                    View Process
                  </div>
                  <!-- polkdot -->
                  <div class="inline-block cursor-pointer open-link-css"
                    @click="goFrontEndDetail(viewInfo.id, viewInfo.recentDeploy)" v-else>
                    View Result
                  </div>
                </div>
              </div>
            </div>
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
  <AptosBuildParams :aptosBuildVisible="aptosBuildVisible" :detailId="viewInfo?.id" :aptosBuildParams="aptosBuildParams"
    @hideAptosBuildVisible="hideAptosBuildVisible" @aptosBuild="aptosBuild" />

  <Configure :visible="evmCheckVisible" @getDoneData="getDoneData" @cancel="handleCancel" />
  <DeployIC v-if="showDeployIC" :visible="showDeployIC" @CancelDeployIC="CancelDeployIC" @showDfxFn="showDfxFn"
    :detailId="viewInfo?.id" :accountIdFlag="accountIdFlag" :walletIdFlag="walletIdFlag" />
  <ConfigureDFX :visible="showDFX" @CancelDFX="CancelDeployDFX" @SaveDFXCon="SaveDFXCon" />
  <ConfigureContractDFX :visible="showContractDFX" @CancelDFX="CancelContractDFX" @SaveDFXCon="SaveDFXCon">
  </ConfigureContractDFX>
</template>

<script lang='ts' setup>
import { ref, toRefs, computed, reactive, defineComponent, type Ref } from 'vue';
import { useRouter } from "vue-router";
import { message } from 'ant-design-vue';
import { fromNowexecutionTime } from "@/utils/time/dateUtils.js";
import { apiProjectsCheck, apiProjectsBuild, apiProjectsDeploy, apiContainerCheck, apiProjectsContainerDeploy, apiCheckSetAptosBuildParams, apiGetAptosBuildParams, apiAptosBuild } from "@/apis/projects";
//弹出层页面
import Configure from './Configure.vue'
import DeployIC from './DeployIC.vue';
import ConfigureDFX from './ConfigureDFX.vue'
import ConfigureContractDFX from './ConfigureContractDFX.vue'
import CustomMsg from '@/components/CustomMsg.vue';
import starkNetModal from '../../components/starkNetModal.vue';
import ContainerParam from './ContainerParam.vue';
import AptosBuildParams from './AptosBuildParams.vue'
import { useThemeStore } from "@/stores/useTheme";
import { ActionButtonEnum, ContractFrameTypeEnum, FrontEndDeployTypeEnum } from "@/enums/frameTypeEnum";
import { RecentStatusEnums, SvgStatusEnums } from "../enums/RecentEnums";
import type { ViewInfoItem, RecentDeployItem } from "@/views/projects/components/data";
import { apiIsCheck } from "@/apis/workFlows"
import { useI18n } from "vue-i18n";
import { apiPostPopover } from "@/apis/workFlows";
import { apiIcpAccount, apiCheckDfx, apiSaveDfx, apiCreateICPIdentity } from '@/apis/canister'

const { t } = useI18n()
const theme = useThemeStore()
const projectId = ref('')

const showDeployIC = ref(false);
const showDFX = ref(false);
const showContractDFX = ref(false);
const accountIdFlag = ref()
const walletIdFlag = ref()
//点击关闭按钮
const handleCancel = () => {
  evmCheckVisible.value = false
}
//弹框
const router = useRouter();
const props = defineProps<{
  viewType: string,
  projectType: string,
  viewInfo: ViewInfoItem,
  // labelDisplay:string
}>()
// const showModal = () => {
//       evmCheckVisible.value = true;
//     };
const actionButtonList = ref([
  { name: 'Check', url: 'check' },
  { name: 'Build', url: 'build' },
  { name: 'Deploy', url: 'deploy' },
  { name: 'Ops', url: 'ops' }]);

const { viewType, viewInfo, projectType } = toRefs(props);
console.log('viewInfo~~~~~~~~', viewInfo.value)

const showViewInfoRepositoryUrl = computed(() => {
  // return viewInfo.value?.repositoryUrl.slice(0, 18) + '...' + viewInfo.value?.repositoryUrl.slice(-3, -1) + viewInfo.value?.repositoryUrl.slice(-1)
  return viewInfo.value?.repositoryUrl.slice(-3, -1) + viewInfo.value?.repositoryUrl.slice(-1)
})
const showViewInfoRepositoryUrlStart = computed(() => {
  return viewInfo.value?.repositoryUrl.slice(0, viewInfo.value?.repositoryUrl.length - 3)
})

const emit = defineEmits(["loadProjects"]);
const containerVisible = ref(false);
const aptosBuildVisible = ref(false)
const disabled = ref(false);
const showMsg = ref(false);
const msgType = ref("");
//设置弹框隐藏
const evmCheckVisible = ref(false)

const deployParams = ref<any>([])
const msgParam = ref({
  id: viewInfo?.value.id,
  workflowsId: viewInfo?.value.recentDeploy.workflowId,
  workflowDetailId: viewInfo?.value.recentDeploy.id,
  projectType: projectType?.value,
  operateType: 1,
});

const starknetVisible = ref(false);
const starknetHashData = JSON.parse(localStorage.getItem('starknetHashData')) || reactive({});
// console.log(starknetHashData, 'starknetHashData')
const deployTxHash = starknetHashData[props.viewInfo.id]?.deployTxHash || '';
// console.log('deployTxHash', props.viewInfo.id, deployTxHash)

const checkCondition = () => {
  if (viewInfo.value.type == '3' || (viewInfo.value.type == '1' && viewInfo.value.frameType == 7) || viewInfo.value.type == '2' && viewInfo.value.deployType == 3) {
    return true;
  } else {
    return false;
  }
}
const opsCondition = () => {
  if (viewInfo.value.type == '2' && viewInfo.value.deployType == 3) {
    return true;
  } else {
    return false;
  }
}

const goDetail = (id: string, type: string) => {
  localStorage.setItem("projectName", viewInfo.value.name)
  localStorage.setItem("projectId", id)
  router.push("/projects/" + id + "/details/" + type);
}
const projectsAction = (val: any, type: string, e: Event) => {
  // Polkadot 的 check禁掉
  if (val.type == '3' && type == 'Check') {
    return
  }
  // contract ic 的 check禁掉
  if (val.type == '1' && val.frameType == 7 && type == 'Check') {
    return
  }
  // ic 的 check 和 ops 禁掉
  if (val.type == '2' && val.deployType == 3 && (type == 'Check' || type == 'Ops')) {
    return
  }
  console.log("projectsAction val:", val);
  switch (type) {
    case 'Check':
      projectsCheck(val.id, val.recentCheck, e);
      break;
    case 'Build':
      projectsBuild(val.id, val.recentBuild, val.frameType, val.type);
      break;
    case 'Deploy':
      projectsDeploy(val.id, val.recentBuild.version, val.recentBuild.status);
      break;
    case 'Ops':
      projectsOps(val.id, val.recentDeploy, val.type);
      break;
    default: break;
  }
}

const getDoneData = async (myArray: string[]) => {
  const tools = myArray?.map((item: string, index: number) => {
    if (item == 'MetaTrust Security Analyzer') {
      item = 'MetaTrust (SA)'
    } else if (item == 'MetaTrust Security Prover') {
      item = 'MetaTrust (SP)'
    } else if (item == 'MetaTrust Open Source Analyzer') {
      item = 'MetaTrust (OSA)'
    } else if (item == 'MetaTrust Code Quality') {
      item = 'MetaTrust (CQ)'
    }
    return item
  })
  const params = {
    tool: tools
  }
  //判断是否有选择
  if (myArray.length > 0) {
    const res = await apiPostPopover(projectId.value, params)
    console.log(res, 'done按钮接口数据');
    evmCheckVisible.value = false

    const { data } = await apiProjectsCheck(projectId.value);
    loadView();

    setMsgShow(data.workflowId, data.detailId, 'check', 1);
    // message.info("The workflow of checking is running, view now.")
  } else {
    message.warning('Please choose tools');
  }
}
// check
const projectsCheck = async (id: string, checkData: any, e: Event) => {
  // Polkadot 的 check禁掉
  if (props.viewInfo.type == '3') {
    return
  }
  // contract ic 的 check禁掉
  if (props.viewInfo.type == '1' && props.viewInfo.frameType == 7) {
    return
  }
  // ic 的 check 和 ops 禁掉
  if (props.viewInfo.type == '2' && props.viewInfo.deployType == 3) {
    return
  }
  console.log('projectsCheck~~~~')
  // if (props.projectType === '1' && props.viewInfo.frameType === 4) {
  //   e.stopPropagation()
  // } else {
  disabled.value = false;
  try {
    //判断是否为EVM 显示弹框 并且 ipfs不弹
    if (props.viewInfo.frameType === 1 && projectType.value === '1') {
      projectId.value = id
      const res = await apiIsCheck(id)
      // message.destroy()
      if (res.code === 200) {
        // 如果没有数据就弹，有数据不弹
        if (JSON.stringify(res.data) === "{}") {
          evmCheckVisible.value = true
        } else {
          const { data } = await apiProjectsCheck(id);
          if (checkData.status !== 1) {
            setMsgShow(data.workflowId, data.detailId, 'check', 1);
          }
          loadView();
        }
      }
    }
    if (checkData.status === 1) {
      // 点击check按钮，提示
      message.info(t('project.pipeline_executing_now'));
    } else {
      //判断是否为EVM 显示弹框
      if (props.viewInfo.frameType === 1 && projectType.value === '1') {
        // evm 没有数据时，弹框唤起不吐丝
        // if (!evmCheckVisible.value) {
        //   setMsgShow(checkData.workflowId, checkData.id, 'check', 1);
        //   // message.info("The workflow of checking is running, view now.")
        // }
      } else {
        const { data } = await apiProjectsCheck(id);

        setMsgShow(data.workflowId, data.detailId, 'check', 1);
        // message.success(res.message);
        loadView();
      }
    }
  } catch (error: any) {
    console.log("erro:", error)
    message.error('Failed ', error);
  } finally {
    // loading.value = false;
  }
  // }
};

const buildStatusAction = async (id: string, buildData: any) => {
  if (buildData.status === 1) {
    setMsgShow(buildData.workflowId, buildData.id, 'build', 2);
  } else {
    const { data } = await apiProjectsBuild(id);
    setMsgShow(data.workflowId, data.detailId, 'build', 2);
    loadView();
  }
}

const aptosBuildParams = ref([])
const goAptosBuild = async (id: string, buildData: any, frameType: string, type: any) => {
  let needsParams = false
  const res = await apiCheckSetAptosBuildParams(id)
  needsParams = res.data.needsParams
  try {
    if (needsParams) {
      aptosBuildVisible.value = true
      const { data } = await apiGetAptosBuildParams(id)
      console.log('apiGetAptosBuildParams:::', data)
      aptosBuildParams.value = data
    } else {
      if (buildData.status == 1) {
        message.info("Executing Now，please wait a moment.");
      } else {
        const { data } = await apiAptosBuild(id)

        setMsgShow(data.workflowId, data.detailId, 'build', 2);

        loadView();
      }
    }

  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  }
}
const getIcpBuildInfo = async (id: string, buildData: any) => {
  const res = await apiIcpAccount(viewInfo.value.id)
  accountIdFlag.value = res.data.accountIdFlag
  walletIdFlag.value = res.data.walletIdFlag
  console.log('build ... accountIdFlag:', res.data.accountIdFlag, 'walletIdFlag:', res.data.walletIdFlag)
  if (!res.data.accountIdFlag || !res.data.walletIdFlag) {
    if (!res.data.accountIdFlag) {
      const res = await apiCreateICPIdentity(viewInfo.value.id)
    }
    showDeployIC.value = true
  } else if (res.data.accountIdFlag && res.data.walletIdFlag) {
    // 是否弹dfx.json配置文件
    const dfxConResult = await apiCheckDfx(viewInfo.value.id)
    // 这里还需要判断是contract 还是 前端项目，弹不同的dfx.json配置框
    if (!dfxConResult.data) {
      if (viewInfo.value.type == '2' && viewInfo.value.deployType == 3) {
        showDFX.value = true
      } else {
        showContractDFX.value = true
      }
    } else {
      buildStatusAction(id, buildData)
    }
  }
}
const projectsBuild = async (id: string, buildData: any, frameType: string, type: any) => {
  console.log('projectsBuild:::', id, buildData, frameType)
  if ((viewInfo.value.type == '1' && frameType == '7') || (viewInfo.value.type == '2' && viewInfo.value.deployType == 3)) {
    await getIcpBuildInfo(id, buildData)
  } else {
    if (frameType == '2' && type == 1) {
      goAptosBuild(id, buildData, frameType, type);
    } else {
      buildStatusAction(id, buildData)
    }
  }
};

// 前端项目 deploy
const frontCommonDeploy = (status: number) => {
  if (status === 3) {
    goFrontendDeploy();
  }
  else {
    // 前端并且是ipfs的时候
    if (viewInfo.value.type == '2' && viewInfo.value.deployType == 1) {
      message.info("Package not avaliable");
    } else {
      if (viewInfo.value.deployType === 3) {
        showDeployIC.value = true;
      } else {
        message.info("Project image not avaliable");
      }
    }
  }
}

const getIcpInfo = async (status: number) => {
  const res = await apiIcpAccount(viewInfo.value.id)
  accountIdFlag.value = res.data.accountIdFlag
  walletIdFlag.value = res.data.walletIdFlag
  console.log('accountIdFlag:', res.data.accountIdFlag, 'walletIdFlag:', res.data.walletIdFlag)
  if (!res.data.accountIdFlag || !res.data.walletIdFlag) {
    if (!res.data.accountIdFlag) {
      const res = await apiCreateICPIdentity(viewInfo.value.id)
    }
    showDeployIC.value = true
  } else if (res.data.accountIdFlag && res.data.walletIdFlag) {
    // 是否弹dfx.json配置文件
    const dfxConResult = await apiCheckDfx(viewInfo.value.id)
    // 这里还需要判断是contract 还是 前端项目，弹不同的dfx.json配置框
    if (!dfxConResult.data) {
      showDFX.value = true
    } else {
      frontCommonDeploy(status)
    }
  }
}

const projectsDeploy = async (id: string, version: string, status: number) => {
  // icp
  if (viewInfo.value.type == '2' && viewInfo.value.deployType == 3) {
    // 前端ic 需要先 build 完成，才能进行部署
    if (status === 0 || status === 1) {
      message.info(t('Project not avaliable.'));
    } else {
      await getIcpInfo(status)
    }
  } else {
    if (projectType?.value === '1' && viewInfo.value.frameType !== 7) {
      if (status === 0 || status === 1 || version === "") {
        // message.info("Smart contract not avaliable.");
        message.info(t('Smart contract not avaliable.'));
      }
      else {
        goContractDeploy(id, version);
      }
    }
    else {
      frontCommonDeploy(status)
    }
  }

};
const projectsOps = async (id: string, recentDeploy: RecentDeployItem, type?: number) => {
  if (projectType?.value === "1") {
    if (recentDeploy.version === "") {
      message.info(t('Smart contract not avaliable.'));
    } else {
      goContractDetail(id, recentDeploy.version);
    }
  } else {
    if (recentDeploy.version === "") {
      message.info(t('Project not avaliable.'));
    } else {
      const path = "/projects/" + recentDeploy.workflowId + "/frontend-details/" + recentDeploy.id + "/" + recentDeploy.packageId + '?fromList=1&type=' + type
      router.push(path);
    }
  }
};
const loadView = async () => {
  //重新查询数据
  emit("loadProjects");
};
const goContractCheck = async (id: string, workflowId: string, detailId: string) => {
  localStorage.setItem("projectName", viewInfo.value.name)
  localStorage.setItem("frameType", viewInfo.value.frameType)
  localStorage.setItem("projectId", id)
  const path = "/projects/" + id + "/" + workflowId + "/workflows/" + detailId + "/1/" + projectType?.value
  router.push(path);
};

const goContractBuild = async (id: string, workflowId: string, detailId: string) => {
  localStorage.setItem("projectName", viewInfo.value.name)
  localStorage.setItem("projectId", id)
  router.push("/projects/" + id + "/" + workflowId + "/workflows/" + detailId + "/2/" + projectType?.value);
  // message.info("Executing Now，please wait a moment.")
};

const goContractDeploy = async (id: string, status: number) => {
  if (localStorage.getItem('projectActiveKey') == '1') {
    localStorage.setItem("projectName", viewInfo.value.name)
    localStorage.setItem("projectId", id)
    // 如果是evm生态走多链部署，其它生态保持原来
    if (viewInfo.value.frameType == 1) {
      router.push(`/projects/projectsDeploymentOrchestration?id=${id}`)
    } else {
      router.push("/projects/" + id + "/artifacts-contract/" + status + "/deploy/00");
    }
    // router.push("/projects/" + id + "/artifacts-contract/" + status + "/deploy/00");
  }
  else if
    (
    localStorage.getItem('projectActiveKey') == '2') {
    if (status === 3) {
      // goFrontendDeploy();
      if (viewInfo.value.type == '2' && viewInfo.value.deployType == 3) {
        getIcpInfo(status)
      }
    }
  }
};

// const showStarknetVisible = (id: string) => {
//   // const starknetHashData: any = JSON.parse(localStorage.getItem('starknetHashData'));
//   // deployTxHash.value = starknetHashData[id].deployTxHash;
//   starknetVisible.value = true;
// };

const goContractDetail = async (id: string, version: string) => {
  // 如果是evm生态走多链部署，其它生态保持原来
  if (viewInfo.value.frameType == 1) {
    router.push(`/projects/projectsDashboard?id=${id}`)
    return
  }
  if (viewInfo.value.frameType === 7 && viewInfo.value.recentDeploy.status === 1) {
    router.push(`/projects/${id}/${deployParams.value[id].wfId}/workflows/${deployParams.value[id].wfDetailId}/3/${projectType?.value}`);
  } else {
    localStorage.setItem("projectName", viewInfo.value.name)
    localStorage.setItem("projectId", id)
    router.push("/projects/" + id + "/contracts-details/" + version + '?fromList=1');
  }
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

    setMsgShow(data.workflowId, data.detailId, 'deploy', 3);

    loadView();
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  }
}

const hideAptosBuildVisible = () => {
  aptosBuildVisible.value = false
}
const aptosBuild = async (id: any) => {
  try {
    const { data } = await apiAptosBuild(id.value)

    setMsgShow(data.workflowId, data.detailId, 'build', 2);

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

    setMsgShow(data.workflowId, data.detailId, 'deploy', 3);

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
const setMsgShow = (workflowId: any, detailId: any, msgTypeVal: string, operateTypeVal: any) => {
  if (msgTypeVal === 'deploy') {
    deployParams.value[viewInfo?.value.id] = {
      wfId: workflowId,
      wfDetailId: detailId
    }
  }
  msgParam.value.workflowsId = workflowId;
  msgParam.value.workflowDetailId = detailId;
  msgParam.value.operateType = operateTypeVal;
  msgType.value = msgTypeVal;
  showMsg.value = true;
  setTimeout(function () {
    showMsg.value = false;
  }, 3000)

}

const goFrontEndDetail = (id: string, recentDeploy: RecentDeployItem) => {
  console.log('recentDeploy:', recentDeploy)
  if (recentDeploy.status === 3) { //success
    router.push(`/projects/${recentDeploy.workflowId}/frontend-details/${recentDeploy.id}/${recentDeploy.packageId}?type=${viewInfo.value.type}`);
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

const openInChainIDE = (data: any) => {
  const repoUrl = data.repositoryUrl
  var url = ''
  const projectId = data.id
  if (data.defaultFile === '') {
    url = `https://staging-9589904a8a.chainide.com/s/createGithubProject?url=${repoUrl}&type=file&source=hamster&projectId=${projectId}&version=soljson-v0.8.17+commit.8df45f5fjs`
  } else {
    const fileName = "contracts/" + data.defaultFile
    url = `https://staging-9589904a8a.chainide.com/s/createGithubProject?url=${repoUrl}&open=${fileName}&type=file&source=hamster&projectId=${projectId}&version=soljson-v0.8.17+commit.8df45f5fjs&line=L1`
  }
  window.open(url)
}

const CancelDeployIC = () => {
  showDeployIC.value = false;
}
// 展示配置dfx.json
const showDfxFn = () => {
  if (viewInfo.value.type == '1' && viewInfo.value.frameType == 7) {
    showContractDFX.value = true;
  } else {
    showDFX.value = true;
  }
}
const CancelDeployDFX = () => {
  showDFX.value = false;
}
const CancelContractDFX = () => {
  showContractDFX.value = false;
}
// 保存dfx.json
const SaveDFXCon = async (params: string) => {
  console.log('保存dfx.json', params)
  const data = {
    jsonData: params
  }
  const res = await apiSaveDfx(viewInfo.value.id, data)
  if (res.code == 200) {
    if ((viewInfo.value.type == '1' && viewInfo.value.frameType == 7) || (viewInfo.value.type == '2' && viewInfo.value.deployType == 3)) {
      showContractDFX.value = false;
      showDFX.value = false;
      buildStatusAction(viewInfo.value.id, viewInfo.value.recentBuild)
    } else {
      showDFX.value = false
      // message.success(res.message)
      goFrontendDeploy();
    }
  } else {
    message.error(res.message)
  }
}
</script>
<style lang='less' scoped>
.center {
  width: 100%;
  padding: 32px;
  border-radius: 12px;
  margin-top: 60px;
}

.first {
  justify-content: space-between;
  margin-bottom: 32px;
  align-items: center;
  display: flex;
  width: 100%;
  position: absolute;
}

@baseColor: #E2B578;


.action-button-disabled {
  color: rgba(38, 38, 38, 0.3);

  label {
    color: rgba(38, 38, 38, 0.3);
  }

  .action-icon {
    .svg-icon {
      color: rgba(38, 38, 38, 0.3);
    }
  }

  ;
}

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

  .action-button-disabled {
    color: rgba(255, 255, 255, 0.3);

    label {
      color: rgba(255, 255, 255, 0.3);
    }

    .action-icon {
      .svg-icon {
        color: rgba(255, 255, 255, 0.3);
      }
    }

    ;
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
  label {
    color: #E2B578;
  }

  .action-icon {
    .svg-icon {
      color: #E2B578;
    }
  }

  ;
}

.action-button-item:active {
  label {
    color: #CE9C58;
  }

  .action-icon {
    .svg-icon {
      color: #CE9C58;
    }
  }

  ;
}

.text-over-css {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}</style>
