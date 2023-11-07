<template>
  <div class="flex" v-if="frameType != 7">
    <div>
      <a-select @change="changeContract" v-model:value="contract"
        :options="contractList.map(item => ({ value: item }))">
      </a-select>
    </div>
    <div class="ml-4">
      <a-select @change="changeContract" v-model:value="version" :options="versionList.map(item => ({ value: item }))">
      </a-select>
    </div>
    <div class="ml-4">
      <a-select @change="changeContract" v-model:value="network" :options="networkList.map(item => ({ value: item }))">
      </a-select>
    </div>
  </div>
  <a-table class="my-4" :columns="contractTableColumns" :dataSource="contractTableList"
    :pagination="contractPagination">
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'version'">
        <label class="text-[#E2B578]">{{ '#'+record.version }}</label>
      </template>
      <template v-if="column.dataIndex === 'network'">
        <label v-if="record.network.String !== ''" v-for="(item, indexF) in record.network.String.split(',')"
          :key="indexF" :class="{ 'ml-2': indexF !== 0 }"
          class="text-[#E2B578] border border-solid rounded-[32px] border-[#E2B578] px-3 py-1">{{ item?.slice(item?.indexOf('/')+1) }}</label>
        <label v-else-if="record.status === 1">Deploying</label>
        <label v-else>-</label>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <!-- <label class="cursor-pointer" v-if="record.network.String !== ''"
          @click="goContractDetail(record.version)">Details</label> -->
        <label class="dark:text-[#E0DBD2] text-[#151210] ml-2 cursor-pointer hoverColor"
          @click="goContractDeploy(record)">Deploy</label>
        <a-tooltip placement="bottomRight" trigger="click" overlayClassName="contract-tooltip">
          <template #title>
            <div class="dark:text-[#E0DBD2] text-[#73706E] cursor-pointer hoverColor" @click="downloadAbi(record)">
              Download ABI
            </div>
            <div @click="starknetVisible = true" v-if="deployTxHash && deployTxHash !== ''"
              class="dark:text-[#E0DBD2] text-[#73706E] cursor-pointer pt-[12px] hoverColor">
              View Deploy Process</div>
            <div v-else="record.network.String !== ''" @click="goContractDetail(record.version)"
              class="dark:text-[#E0DBD2] text-[#73706E] cursor-pointer pt-[12px] hoverColor">View
              Dashboard
            </div>
          </template>
          <label class="dark:text-[#E0DBD2] text-[#151210] ml-2 cursor-pointer hoverColor">More</label>
        </a-tooltip>
      </template>
    </template>
  </a-table>

  <starkNetModal :starknetVisible="starknetVisible" :deployTxHash="deployTxHash" @cancelModal="starknetVisible = false">
  </starkNetModal>
  <CustomMsg :showMsg="showMsg" :msgType="msgType" :msgParam="msgParam"></CustomMsg>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs } from 'vue';
import { useRouter,useRoute } from "vue-router";
import { message } from 'ant-design-vue';
import { formatDateToLocale } from '@/utils/dateUtil';
import CustomMsg from '@/components/CustomMsg.vue';
import {
  apiGetProjectsContract,
  apiProjectsContractName,
  apiProjectsContractNetwork,
  apiProjectsVersion,
  apiProjectsDeploy
} from "@/apis/projects";
import starkNetModal from "@/views/projects/components/starkNetModal.vue";
const router = useRouter();
const route = useRoute()
const props = defineProps({
  detailId: String,
  frameType: Number,
  name:String
});
const { detailId, frameType, name } = toRefs(props);

const contractList = ref(["All Contract"]);
const contract = ref("All Contract");
const versionList = ref(["All Version"]);
const version = ref("All Version");
const networkList = ref(["All Network"]);
const network = ref("All Network");
const contractTableList = ref([]);

const starknetVisible = ref(false);
const starknetHashData = JSON.parse(localStorage.getItem('starknetHashData')) || reactive({});
// console.log(starknetHashData, 'starknetHashData')
const deployTxHash = starknetHashData[props.detailId]?.deployTxHash || '';

const showMsg = ref(false);
const msgType = ref("");
const msgParam = ref({
  id: detailId.value,
  workflowsId: 0,
  workflowDetailId: 0,
  projectType: 0,
  operateType: 1,
});

const contractTableColumns = ref( [
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
    title: 'Branch',
    dataIndex: 'branch',
    align: 'center',
    ellipsis: 'fixed',
    key: 'branch',
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

onMounted(() => {
  
  if (frameType?.value === 7) {
    contractTableColumns.value = contractTableColumns.value.filter(item => item.dataIndex !== 'network')
  } else {
    contractTableColumns.value = contractTableColumns.value.filter(item => item.dataIndex !== 'branch')
  }

  getProjectsContract();
  getProjectsContractName();
  getProjectsContractNetwork();
  getProjectsVersion();
})
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
    // data.data.map((item: any) => {
    //   item.networkString = item.network.String ? item.network.String.split('/')[1] : '';
    // })
    contractTableList.value = data.data;
    contractPagination.total = data.total

  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
};


const getProjectsVersion = async () => {
  try {
    const { data } = await apiProjectsVersion(detailId.value.toString());
    const items = data.filter(function (val: any) {
        return val && val.trim(); 
    })
    versionList.value.length = 1;
    versionList.value = versionList.value.concat(items);

  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
};
const getProjectsContractNetwork = async () => {
  try {
    const { data } = await apiProjectsContractNetwork(detailId.value.toString());
    const items = data.filter(function (val: any) {
        return val && val.trim(); 
    })
    networkList.value.length = 1;
    networkList.value = networkList.value.concat(items);
  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
};

const getProjectsContractName = async () => {
  try {
    const { data } = await apiProjectsContractName(detailId.value.toString());
    const items = data.filter(function (val: any) {
        return val && val.trim(); 
    })
    contractList.value.length = 1;
    contractList.value = contractList.value.concat(items);

  } catch (error: any) {
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
};

const downloadAbi = (val: any) => {
  if (frameType?.value === 5) { //sui
    message.info("Sorry, Sui contract currently does not support ABI file download.");
  } else {
    const str = val.abiInfo;
    const url = `data:,${str}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${val.name}.json`;
    a.click();
    a.remove();
  }
};

const goContractDetail = async (version: String) => {
  router.push("/projects/" + detailId.value + "/contracts-details/" + version);
};

const goContractDeploy = async (contractData: any) => {
  if (frameType?.value === 7) { 
    frontendDeploying(contractData)
  } else if(frameType?.value === 1){
    // 如果是evm生态走多链部署，其它生态保持原来
    router.push(`/projects/projectsDeploymentOrchestration?id=${detailId?.value}&version=${contractData.version}`)
  } else {
    const path = "/projects/" + detailId.value + "/artifacts-contract/" + contractData.version + "/deploy/" + contractData.name
    router.push(path);
  }
};
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

defineExpose({
  getProjectsContract
})
</script>
<style lang="less" scoped>
.hoverColor {
  &:hover {
    color: #E2B578;
  }
}
</style>
