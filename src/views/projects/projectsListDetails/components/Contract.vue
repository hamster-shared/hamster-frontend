<template>
  <div class="flex">
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
          class="text-[#E2B578] border border-solid rounded-[32px] border-[#E2B578] px-3 py-1">{{ item }}</label>
        <label v-else-if="record.status === 1">Deploying</label>
        <label v-else>-</label>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <!-- <label class="cursor-pointer" v-if="record.network.String !== ''"
          @click="goContractDetail(record.version)">Details</label> -->
        <label class="dark:text-[#E0DBD2] text-[#151210] ml-2 cursor-pointer hoverColor"
          @click="goContractDeploy(record.name, record.version)">Deploy</label>
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
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRefs } from 'vue';
import { useRouter } from "vue-router";
import { formatDateToLocale } from '@/utils/dateUtil';
import {
  apiGetProjectsContract,
  apiProjectsContractName,
  apiProjectsContractNetwork,
  apiProjectsVersion,
} from "@/apis/projects";
import starkNetModal from "@/views/projects/components/starkNetModal.vue";
const router = useRouter();
const props = defineProps({
  detailId: String,
});
const { detailId } = toRefs(props);

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
  // ???????????????
  pageSize: 10, // ?????????????????????
  current: 1, // ?????????
  total: 10, // ??????
  size: 'small',
  position: ['bottomCenter'], //???????????????????????????
  hideOnSinglePage: false, // ????????????????????????????????????
  showQuickJumper: false, // ?????????????????????????????????
  showSizeChanger: false, // ?????????????????? pageSize
  pageSizeOptions: ['10', '20', '30'], // ?????????????????????????????????
  onShowSizeChange: (current: number, pagesize: number) => {
    // ?????? pageSize????????????
    contractPagination.current = current;
    contractPagination.pageSize = pagesize;
    getProjectsContract();
  },
  onChange: (current: number) => {
    // ???????????????????????????
    contractPagination.current = current;
    getProjectsContract();
  },
  // showTotal: total => `?????????${total}???`, // ??????????????????
});

onMounted(() => {
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
    versionList.value.length = 1;
    versionList.value = versionList.value.concat(data);

  } catch (error: any) {
    console.log("erro:", error)
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
    console.log("erro:", error)
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
    console.log("erro:", error)
  } finally {
    // loading.value = false;
  }
};

const downloadAbi = (val: any) => {
  const str = val.abiInfo;
  const url = `data:,${str}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = `${val.name}.json`;
  a.click();
  a.remove();
};

const goContractDetail = async (version: String) => {
  router.push("/projects/" + detailId.value + "/contracts-details/" + version);
};

const goContractDeploy = async (contract: String, version: String) => {
  router.push("/projects/" + detailId.value + "/artifacts-contract/" + version + "/deploy/" + contract);
};

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
