<template>
  <div
    class="contracyList p-[32px] dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] rounded-[12px] my-[32px]">
    <div class="flex justify-between mb-[32px]">
      <span class="text-[24px] font-bold">{{ $t("workFlows.contractList") }}</span>
      <a-button class="btn" @click="toDeployUrl(contractListData[0])" :disabled="contractListData?.length <= 0">{{
        $t('common.deploy')
      }}</a-button>
    </div>
    <a-table :dataSource="contractListData" :columns="columns" :pagination="false" style="width:100%"
      :class="contractListData.length <= 0 ? 'no-table-data' : ''">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'network'">
          <label v-if="record.network.String !== ''" v-for="(item, indexF) in record.network.String.split(',')"
            :key="indexF" :class="{ 'ml-2': indexF !== 0 }"
            class="border border-solid rounded-[32px] dark:border-[#E0DBD2] border-[#73706E]  px-1 py-1">{{
              item.slice(item?.indexOf('/')+1)
            }}</label>
          <label v-else-if="record.status === 1">Deploying</label>
          <label v-else>-</label>
        </template>
        <template v-if="column.key === 'action'">
          <label class="dark:text-[#E0DBD2] text-[#151210] cursor-pointer hoverColor" @click="toDeployUrl(record)">{{
            $t('common.deploy')
          }}</label>
          <a-divider type="vertical" />
          <!-- <a class="dark:text-[#E0DBD2] text-[#151210]" @click="toDetailUrl(record)">{{ $t('common.detail') }}</a> -->
          <a-tooltip placement="bottomRight" trigger="click" overlayClassName="contract-tooltip">
            <template #title>
              <div class="dark:text-[#E0DBD2] text-[#73706E] cursor-pointer hoverColor" @click="downloadAbi(record)">
                Download ABI
              </div>
              <div @click="starknetVisible = true" v-if="deployTxHash && deployTxHash !== ''"
                class="dark:text-[#E0DBD2] text-[#73706E] cursor-pointer pt-[12px] hoverColor">
                View Deploy Process</div>
              <div v-if="record.network.String !== ''"
                class="dark:text-[#E0DBD2] text-[#73706E] cursor-pointer pt-[12px] hoverColor"
                @click="toDetailUrl(record)">View Dashboard
              </div>
            </template>
            <label class="dark:text-[#E0DBD2] text-[#151210] cursor-pointer hoverColor">More</label>
          </a-tooltip>

        </template>
      </template>
    </a-table>
  </div>
  <starkNetModal :starknetVisible="starknetVisible" :deployTxHash="deployTxHash" @cancelModal="starknetVisible = false">
  </starkNetModal>
  <a-modal v-model:visible="aptosAbiShow" title="Operation Warning" :footer="null">
    <template #closeIcon>
      <img class="" src="@/assets/icons/closeIcon.svg" />
    </template>
    <p>Please deploy contract before downloading.</p>
    <div class="text-center">
      <a-button class="done-btn" @click="aptosAbiShow=false">Done</a-button>
    </div>
  </a-modal>
  <CustomMsg :showMsg="showMsg" :msgType="msgType" :msgParam="msgParam"></CustomMsg>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from "vue";
import { useRouter,useRoute } from "vue-router";
import { message } from 'ant-design-vue';
import dayjs from "dayjs";
import CustomMsg from '@/components/CustomMsg.vue';
import starkNetModal from "@/views/projects/components/starkNetModal.vue";
import {
  apiProjectsDeploy
} from "@/apis/projects";

const router = useRouter();
const route = useRoute()
const columns = ref([{
  title: 'Contract',
  dataIndex: 'name',
  align: "center",
  width: '20%',
  ellipsis: true,
  key: 'name',
},
{
  title: 'Version',
  dataIndex: 'version',
  align: "center",
  width: '15%',
  customRender: ({ text }) => {
    if (text) {
      return '#' + text
    }
  },
  key: 'version',
},
{
  title: 'Branch',
  dataIndex: 'branch',
  align: 'center',
  ellipsis: 'fixed',
  key: 'branch',
},
{
  title: 'Network',
  dataIndex: 'network',
  width: '25%',
  align: "center",
  key: 'network',
},
{
  title: 'Build Time',
  dataIndex: 'buildTime',
  align: "center",
  width: '20%',
  ellipsis: true,
  customRender: ({ text }) => {
    return dayjs(text).format('YYYY/MM/DD HH:mm:ss')
  },
  key: 'buildTime'
},
{
  title: 'Action',
  align: "center",
  key: 'action',
}]);

const state = reactive({
  id: router.currentRoute.value.params?.id,
  version: router.currentRoute.value.params?.version,
})

const aptosAbiShow = ref(false)

const starknetVisible = ref(false);
const starknetHashData = JSON.parse(localStorage.getItem('starknetHashData')) || reactive({});
// console.log(starknetHashData, 'starknetHashData')
const deployTxHash = starknetHashData[state.id]?.deployTxHash || '';

const props = defineProps({
  contractListData: Array,
  frameType:Number,
  currentName:String
})

const { contractListData,frameType,currentName } = toRefs(props)

const showMsg = ref(false);
const msgType = ref("");
const msgParam = ref({
  id: router.currentRoute.value.params?.id,
  workflowsId: 0,
  workflowDetailId: 0,
  projectType: 0,
  operateType: 1,
});

const toDeployUrl = (val: any) => {
  if (frameType?.value === 7) { 
    frontendDeploying(val)
  } else {
    const contract = val.id || '00';
    const path = `/projects/${val.projectId}/artifacts-contract/${val.version}/deploy/${contract}?name=${currentName?.value?.replace('#','[')}`
    router.push(path)
  }
}

const frontendDeploying = async (contractData: any) => {
  try {
    const params = ref({
      id: contractData.projectId,
      workflowsId: contractData.workflowId,
      workflowDetailId: contractData.workflowDetailId,
    });
    const { data } = await apiProjectsDeploy(params.value);
    
    setMsgShow(data.workflowId, data.detailId, 'deploy', 3);

    // loadView();
  } catch (error: any) {
    console.log("erro:", error)
    message.error(error.response.data.message);
  }
}
const setMsgShow = (workflowId: any, detailId: any, msgTypeVal: string, operateTypeVal: any) => {
  msgParam.value.workflowsId = workflowId;
  msgParam.value.workflowDetailId = detailId;
  msgParam.value.operateType = operateTypeVal;
  msgType.value = msgTypeVal;
  showMsg.value = true;
  setTimeout(function () {
    showMsg.value = false;
  }, 3000)

}

const toDetailUrl = (val: any) => {
  router.push(`/projects/${val.projectId}/contracts-details/${val.version}`)
}

const downloadAbi = (val: any) => {
  // aptos 这一步没有abi信息
  if (frameType?.value == 2) {
    aptosAbiShow.value = true
  }
  else if (frameType?.value === 5) { //sui
    message.info("Sorry, Sui contract currently does not support ABI file download.");
  }
  else {
    const str = val.abiInfo;
    const url = `data:,${str}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${val.name}.json`;
    a.click();
    a.remove();
  }
};


onMounted(() => {
  if (frameType?.value === 7) {
    columns.value = columns.value.filter(item => item.dataIndex !== 'network')
  } else {
    columns.value = columns.value.filter(item => item.dataIndex !== 'branch')
  }
})
</script>

<style lang="less" scoped>
.btn {
  width: 131px;
  height: 43px;
}

:deep(.ant-btn[disabled]) {
  color: #fff;
  border-color: #E2B578;
  background-color: #E2B578;
}

:deep(.ant-btn[disabled]:hover) {
  color: #fff;
  border-color: #E2B578;
  background-color: #E2B578;
}

.hoverColor {
  &:hover {
    color: #E2B578;
  }
}
</style>
