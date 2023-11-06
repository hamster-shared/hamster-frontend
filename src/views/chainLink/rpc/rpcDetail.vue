<template>
  <div class="rpc-detail">
    <bread-crumb :routes="breadCrumbInfo"/>
    <div
      class="dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px] mt-[24px] border border-solid dark:border-[#434343] border-[#EBEBEB]">
      <div class="">
        <img :src="imageUrl" class="h-6;"/>
        <span class="font-bold text-[24px] mr-[20px] align-middle" style="margin-left: 10px;">{{name}}</span>
        <span v-if="parseInt(chainData.chainID,16) && chainData.isEvm" @click="addNetwork" class="open-link-css border border-solid border-[#E2B578] rounded-[32px] px-[15px] py-[6px] cursor-pointer">Add
          Network</span>
      </div>
      <a-tabs v-model:activeKey="tabNetwork" @change="handleChange">
        <a-tab-pane :key="item.network" :tab="item.network" v-for="item in chainsList"></a-tab-pane>
      </a-tabs>
      <div>
        <div>
          <div class="grid grid-cols-3 gap-1">
            <div v-if="parseInt(chainData.chainID,16)">Chain ID</div>
            <div>Currency</div>
            <div>Explorers</div>
          </div>
          <div class="grid grid-cols-3 gap-1 font-bold mt-[10px] dark:text-[#E0DBD2] text-[#383B46]">
            <div v-if="parseInt(chainData.chainID,16)">{{ parseInt(chainData.chainID,16) }}</div>
            <div>{{ chainData.nativeToken }}</div>
            <div>{{ chainData.explorerUrl }}</div>
          </div>
        </div>
        <div v-if="newtworkChainsData.http_link">
          <div class="text-[16px] mb-[12px] mt-[32px]">RPC</div>
          <div
            class="flex justify-between p-[16px] border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px]">
            <div class="font-bold">{{ newtworkChainsData.http_link }}</div>
            <div class="open-link-css cursor-pointer" @click="copyInfo(newtworkChainsData.http_link)">
              <svg-icon name="copy" size="18" class="mr-[4px]" />
            </div>
          </div>
        </div>
        <div v-if="newtworkChainsData.websocket_link">
          <div class="text-[16px] mb-[12px] mt-[24px]">Websocket</div>
          <div
            class="flex justify-between p-[16px] border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px]">
            <div class="font-bold">{{ newtworkChainsData.websocket_link }}</div>
            <div class="open-link-css cursor-pointer" @click="copyInfo(newtworkChainsData.websocket_link)">
              <svg-icon name="copy" size="18" class="mr-[4px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px] mt-[24px] border border-solid dark:border-[#434343] border-[#EBEBEB]">
      <div class="font-bold text-[20px]">Choose a language</div>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane :tab="key" v-for="(value,key) in codeExamples" :key="key">
          <div class="mt-4" :style="editHeight">
            <CodeEditor :readOnly="true" :value="value"></CodeEditor>
          </div>
          <div class="text-right">
            <span class="text-right cursor-pointer open-link-css" @click="copyInfo(value)">
              <svg-icon name="copy" size="18"></svg-icon>
            </span>
          </div>
      </a-tab-pane>
      </a-tabs>
      <div class="mt-[32px]">
        <a-table :dataSource="dataSource" :columns="columns" :pagination="currentPagination"></a-table>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import BreadCrumb from "@/components/BreadCrumb.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import { formatDateToLocale } from '@/utils/dateUtil';
import { message } from "ant-design-vue";
import { apiGetRPCChain, apiGetrequestLog } from "@/apis/rpcs";
import { hasChanged } from "@vue/shared";
import { addToChain } from '@/utils/changeNetwork'
const { params,query } = useRoute()
const projectName = ref(params.chain);
const loading = ref(false);
const dataSource = ref([]);
const tabLanguage = ref('JavaScript');
const tabNetwork = ref(query.network);
const languageList = ref<any>([]);
const editHeight = ref("height: 220px");
const sourceContent = ref();
const chainData = reactive<any>({});
const newtworkChainsData = reactive({});
const chainsList = ref([]);
const codeExamples = reactive<any>({});
const activeKey = ref("JavaScript");
const { ethereum } = window;
const name = ref('')
const imageUrl = ref('')
const addNetInfo = reactive<any>({
  chainId:'',
  chainName:'',
  rpcUrls:''
})
const breadCrumbInfo = ref<any>([])
// 从Dashboard进来
const fromDashboard = query.fromDashboard
// 从fromMiwaspace进来
const fromMiwaspace = query.fromMiwaspace
console.log('fromDashboard',fromDashboard,query)

const columns = [
  {
    title: 'Number',
    dataIndex: 'number',
    align: "center",
    key: 'number',
    customRender: ({ index }:any) => {
      return index+1
    },
  },
  {
    title: 'Time',
    dataIndex: 'time',
    align: "center",
    key: 'time',
    customRender: ({ text: date }: any) => formatDateToLocale(date).format("YYYY/MM/DD HH:mm:ss"),
  },
  {
    title: 'Request event',
    dataIndex: 'request_event',
    align: "center",
    key: 'request_event',
  },
  {
    title: 'Request result',
    dataIndex: 'request_result',
    align: "center",
    key: 'request_result',
  },
]

const getChainData = async () => {
  try {
    const { data } = await apiGetRPCChain(params.chain);
    chainsList.value = data.chains;
    name.value = data.name;
    imageUrl.value = data.image;
    Object.assign(codeExamples, chainsList.value[0].App.code_examples);
    addNetInfo.chainId = chainsList.value[0].chainID
    addNetInfo.chainName = chainsList.value[0].networkName
    addNetInfo.rpcUrls = chainsList.value[0].networkUrl
    // languageList.value = Object.keys(codeExamples);
    // tabNetwork.value = chainsList.value[0].network;
    Object.assign(newtworkChainsData, chainsList.value[0].App)
    Object.assign(chainData, chainsList.value[0]);
    // console.log(data, 'data')
  } catch (err) {
    console.log(err)
  }
}
// 添加网络到钱包上
const addNetwork = ()=>{
  addToChain(`0x${addNetInfo.chainId}`,addNetInfo.chainName,newtworkChainsData.http_link,chainData.nativeToken,chainData.decimals)
}
const handleChange = (val: string) => {
  const data:any = chainsList.value.find((item: any) => { return item.network === val });
  addNetInfo.chainId = data.chainID
  addNetInfo.chainName = data.networkName
  addNetInfo.rpcUrls = data.networkUrl
  Object.assign(codeExamples, data.App.code_examples);
  Object.assign(newtworkChainsData, data.App);
  Object.assign(chainData, data);
  getRequestLogData();
}

const getRequestLogData = async () => {
  const params = {
    page: currentPagination.current,
    size: currentPagination.pageSize,
  }
  try {
    const { data, pagination } = await apiGetrequestLog(newtworkChainsData.api_key, params);
    dataSource.value = data;
    currentPagination.total = pagination.total;
  } catch (err: any) {
    console.log(err)
  }
}

const currentPagination = reactive({
  // 分页配置器
  pageSize: 5, // 一页的数据限制
  current: 1, // 当前页
  total: 0, // 总数
  size: 'small',
  position: ['bottomCenter'], //指定分页显示的位置
  hideOnSinglePage: false, // 只有一页时是否隐藏分页器
  showQuickJumper: false, // 是否可以快速跳转至某页
  showSizeChanger: false, // 是否可以改变 pageSize
  pageSizeOptions: ['5'], // 指定每页可以显示多少条
  onShowSizeChange: (current: number, pagesize: number) => {
    // 改变 pageSize时的回调
    currentPagination.current = current;
    currentPagination.pageSize = pagesize;
    getRequestLogData()
  },
  onChange: (current: number) => {
    // 切换分页时的回调，
    currentPagination.current = current;
    getRequestLogData()
  },
});

const copyInfo = async (_items: any) => {
  let inp = document.createElement("input");
  document.body.appendChild(inp);
  inp.value = _items;
  inp.select();
  document.execCommand("copy", false);
  inp.remove();
  message.success('copy success')
}
// 判断跳转来源
const judgeOrigin = ()=>{
  let name = ''
  let jumpPath = ''
  if(fromDashboard){
    name = 'Dashboard'
    jumpPath = '/middleware/dashboard'
  }else if(fromMiwaspace){
    name = 'Miwaspace'
    jumpPath = '/middleware/miwaspace?key=1'
  }else{
    name = 'Rpc'
    jumpPath = '/middleware/dashboard/rpc/index'
  }
  breadCrumbInfo.value = [
    {
      breadcrumbName: name,
      path: jumpPath
    },
    {
      breadcrumbName:projectName.value,
      path:''
    },
  ]
}
onMounted(async () => {
  await getChainData();
  await getRequestLogData();
  console.log('tabNetwork',tabNetwork.value)
  judgeOrigin()
  handleChange(tabNetwork.value)
})
</script>
<style lang='less' scoped>
:deep(.ant-radio-group .ant-radio-button-wrapper) {
  border-radius: 0;
}

:deep(.ant-radio-group) {
  margin-top: 24px;
}
</style>