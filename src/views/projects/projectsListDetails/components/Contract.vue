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
            <div v-if="record.network.String !== ''" @click="goContractDetail(record.version)"
              class="dark:text-[#E0DBD2] text-[#73706E] cursor-pointer pt-[12px] hoverColor">View
              Dashboard
            </div>
          </template>
          <label class="dark:text-[#E0DBD2] text-[#151210] ml-2 cursor-pointer hoverColor">More</label>
        </a-tooltip>
      </template>
    </template>
  </a-table>
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
