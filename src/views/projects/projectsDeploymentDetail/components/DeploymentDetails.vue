<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'" class="dark:bg-[#1D1C1A] bg-[#FFFFFF] mt-[25px] rounded-[12px] p-[32px]">
    <div class="flex justify-between items-center">
      <div class="font-bold text-[24px]">Deployment Details</div>
      <div>
        <a-button type="primary" ghost @click="stop">Stop</a-button>
        <!-- <a-button type="primary" class="mx-[24px]">View Dashboard</a-button> -->
        <a-select ref="select" v-model:value="actionVal" class="w-[140px] !ml-[24px]"
          :options="actionOptions" @select="goPage(actionVal)">
        </a-select>
      </div>
    </div>
    <div class="my-[24px] py-[16px] px-[32px] border border-solid border-[#E2B578] rounded-[12px] bg-[rgba(226,181,120,0.1)]">
      <svg-icon name="tips" size="26" class="svg-color mr-2" />
      The following contracts will be deployed on the {{ network }}
    </div>
    <div v-if="executeArrange.length > 0">
      <a-collapse v-model:activeKey="activeKey">
        <a-collapse-panel v-for="(item,index) in executeArrange" :key="index" :header="item.name?.indexOf('.')!='-1' ? item.name : `Deploy ${item.name}`" @click.stop="getTransactionInfoByHash(item.transactionHash, index, item.status)">
          <template #extra>
            <div class="flex items-center">
              <div v-if="item.transactionHash" class="text-[#E2B578] text-[14px] font-semibold cursor-pointer mr-[20px]" @click.stop="goTranscationUrl(item.transactionHash)">View on block explorer</div>
              <div v-if="item.status === 'FAILED' || item.status === 'STOP'" class="text-[#E2B578] font-semibold mr-[20px]" @click.stop="reDeploy">{{item.name?.indexOf('.')!='-1' ? 'Retry':'Redeploy'}}</div>
              <!-- <img :src="getImageURL(`deploy${item.status}.png`)" class="h-[22px] mr-2" /> -->
              <svg-icon :name="`deploy${item.status}`" size="22" class="mr-2 text-[#fff]" />
              <div>{{ item.status }}</div>
            </div>
          </template>
          <div class="bg-[#F6F6F6] dark:bg-[#191816]">
            <div v-if="Object.keys(item.transactionInfo).length > 0" class="p-[20px] flex justify-between">
              <div>{{ item.transactionInfo.index }}
                <div class="flex items-center">
                  <div class="collapse-content-title">Transaction Hash:</div>
                  <div>{{ getPonitStr(item.transactionInfo.transactionHash,6,4) }}
                    <svg-icon name="copy" size="18" class="svg-color ml-2"  @click="copyToClipboard(item.transactionInfo.transactionHash)"/>
                  </div>
                </div>
                <div class="flex items-center mt-[10px]">
                  <div class="collapse-content-title">Block:</div>
                  <div>{{ item.transactionInfo.block }}</div>
                </div>
                <div class="flex items-center mt-[10px]">
                  <div class="collapse-content-title">TimeStamp:</div>
                  <div>{{ item.transactionInfo.timeStamp }}</div>
                </div>
                <div class="flex items-center mt-[10px]">
                  <div class="collapse-content-title">From:</div>
                  <div>{{ item.transactionInfo.from }}
                    <svg-icon name="copy" size="18" class="svg-color ml-2"  @click="copyToClipboard(item.transactionInfo.from)"/>
                  </div>
                </div>
                <div class="flex items-center mt-[10px]">
                  <div class="collapse-content-title">To:</div>
                  <div>{{ item.transactionInfo.to }}
                    <svg-icon name="copy" size="18" class="svg-color ml-2"  @click="copyToClipboard(item.transactionInfo.to)"/>
                    <svg-icon v-if="item.status=='FAILED'" name="warn-failed" size="18" class="svg-color ml-2" />
                  </div>
                </div>
                <div v-if="item.status=='FAILED'" class="flex items-center mt-[10px]">
                  <div class="collapse-content-title"></div>
                  <div class="text-[#F52222]">
                    <svg-icon name="icon-include" size="12" class="ml-2 text-[#73706E] mb-[8px]"/>
                    {{ item.errorInfo }}</div>
                </div>
                <div class="flex items-center mt-[10px]">
                  <div class="collapse-content-title">Value:</div>
                  <div>{{ item.transactionInfo.value }}</div>
                </div>
                <div class="flex items-center mt-[10px]">
                  <div class="collapse-content-title">Tansaction Fee:</div>
                  <div>{{ item.transactionInfo.transactionFee }}</div>
                </div>
                <div class="flex items-center mt-[10px]">
                  <div class="collapse-content-title">Gas Price:</div>
                  <div>{{ item.transactionInfo.gasPrice }}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-[#666666] text-[18px] font-medium py-[70px] text-center overflow-y-scroll h-[200px] w-[100%] break-word break-all whitespace-normal" :class="[(item.errorInfo && !item.transactionHash)?'!py-[0px] !text-left':'py-[70px]']">
              <label v-if="item.result==0 || item.result" class="text-[#D5D1CA] text-[14px] font-normal">{{item.result}}</label>
              <label v-else-if="item.errorInfo && !item.transactionHash" class="text-[#D5D1CA] text-[14px] font-normal">{{item.errorInfo}}</label>
              <label v-else-if="!item.transactionHash || item.status=='RUNNING'">NO Data</label>
              <LoadingOutlined v-else-if="item.transactionHash" :style="{fontSize: '50px', color: '#E2B578'}"></LoadingOutlined>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
  <DeploymentOrchestrationmodal v-if="orchestrationInfo" :orchestrationInfo="orchestrationInfo" :showVisible="showOrchestrationInfo" @hideVisible="hideOrchestrationInfo" />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import{ copyToClipboard, getPonitStr } from "@/utils/tool";
import { useThemeStore } from "@/stores/useTheme";
import DeploymentOrchestrationmodal from "./DeploymentOrchestrationmodal.vue";
import { apiWaitContractList, apiGetExecuteInfoById, apiGetNetworkByName } from '@/apis/contractOrchestrationDeploy';
import { getTransactionInfo } from "@/views/projects/projectsDeploymentOrchestration/components/utils/evm";
import { LoadingOutlined } from '@ant-design/icons-vue';
import { apiGetProjectsContract } from "@/apis/workFlows";
import NewEngine, {formatContractList} from "@/views/projects/projectsDeploymentOrchestration/components/utils/engine";
import type {DeployRecord} from "@/views/projects/projectsDeploymentOrchestration/components/DeployData";
import {ethers} from "ethers";
const provider = new ethers.providers.Web3Provider(window.ethereum)
const newEngine = new NewEngine(provider)

const props = defineProps({
  version:{
    type:String,
    default:''
  }
})
const { version } = toRefs(props)

const theme = useThemeStore();
const route = useRoute()
const router = useRouter()
// 展示部署信息弹框
const showOrchestrationInfo = ref(false)
const orchestrationInfo = ref<any>();
//获取执行信息 
const executeArrange = ref<any>([]);
// 跳转第三方网址base url
const blockExplorerUrl = ref('')
// 点击单个列表查询信息所需的参数
const rpcUrl = ref('')
const symbol = ref('')
// 网络名称
const network = ref('');
const timer = ref(); //轮询定时器
const timeStop = ref(false);
const statusSucNum = ref(0); //记录status是success的数量

const activeKey = ref<any>([]);
const actionVal = ref('All Action')
const actionOptions = ref([
  {label: 'View Dashboard', value: 'Dashboard'},
  {label: 'View Setting', value: 'Setting'},
]);

const goPage = (val:string)=>{
  actionVal.value = 'All Action'
  console.log('goPage', val)
  if(val=='Dashboard'){
    router.push(`/projects/projectsDashboard?id=${route.query.id}`)
  }else{
    showOrchestrationInfo.value = true
  }
}
//隐藏弹框
const hideOrchestrationInfo = () => {
  showOrchestrationInfo.value = false;
}
// 根据执行id获取执行信息 
const getExecuteInfoById = async () => {
  if(!route.query.executeId) return
  const res = await apiGetExecuteInfoById(route.query.id, route.query.executeId);
  console.log("根据执行id获取执行信息:", res);
  if (res.code == 200) {
    network.value = res.data.network;
    //设置执行信息数据
    setExecuteInfoList(JSON.parse(res.data.arrangeProcessData));
    //判断是否轮询
    if (timeStop.value) {
      clearTimeout(timer.value); //停止轮询
    } else {
      timer.value = setTimeout(() => {
        getExecuteInfoById();
    }, 3000)
    }
  }
}
//设置执行信息数据
const setExecuteInfoList = (arrangeData: any) => {
  console.log("arrangeData::",arrangeData);
  //初始化字段值
  executeArrange.value.length = 0;
  statusSucNum.value = 0;
  //遍历数据
  arrangeData.deployStep.forEach((ele: any) => {
    if (Object.keys(ele).length > 0) {
      setTimerByStatus(ele.status);
      // let proxy = ele.contract.proxy ? ' proxy' : '';
      let params:any = {
        name: ele.contract.name,
        status: ele.status,
        transactionHash: '',
        transactionInfo: {},
        result:ele.result,
        errorInfo:ele.errorInfo
      }
      executeArrange.value.push(params);
      //遍历steps数组
      ele.steps.forEach((item: any) => {

        if (ele.contract.proxy && item.type == 'proxyConstructor' || item.type == 'constructor') {
          params.transactionHash = item.transactionHash || '';
          params.status = item.status;
          params.result=item.result;
          params.errorInfo=item.errorInfo
        }
        
        if (item.type == "function") {  
          setTimerByStatus(item.status);
          params = {
            name: item.contractName + '.' + item.method,
            status: item.status,
            transactionHash: item.transactionHash || '',
            transactionInfo: {},
            result:item.result,
            errorInfo:item.errorInfo
          }
          executeArrange.value.push(params);
        }
      });
    }
  });
  //所有的状态都是success，终止轮询
  if (executeArrange.value.length == statusSucNum.value) {
    timeStop.value = true;
  }
  console.log("executeArrange::",executeArrange.value);
}
// 判断是否继续轮询
const setTimerByStatus = (status: any) => {
  // debugger
  // if (!timeStop.value) {
    //有一条数据的状态是 stop 或 failed 则停止轮询
    if (status == 'STOP' || status == 'FAILED') {
      timeStop.value = true; //停止轮询
      return
    } else if (status == 'PENDING' || status == 'RUNNING') {
      timeStop.value = false; //继续轮询
    } else if (status == 'SUCCESS') {
      statusSucNum.value++;
    }
  // }
}

// 获取单个合约的执行信息
const getTransactionInfoByHash = async (transactionHash: any, key: any, status: string) => {
  // 如果没有hash 不调接口
  if(!transactionHash || status== 'RUNNING'){
    return
  }
  if (transactionHash != "" && activeKey.value.indexOf(key.toString()) > -1) {
    const res = await getTransactionInfo(transactionHash, rpcUrl.value, symbol.value);
    executeArrange.value[key].transactionInfo = res
    console.log('根据transactionHash调的接口返回数据：',executeArrange.value[key].transactionInfo)
  }
  console.log("getTransactionInfoByHash executeArrange:",executeArrange.value);
}
// 获取原始编排参数
const getOriginalArrangeList = async () => {
  const res = await apiWaitContractList(route.query.id, version.value);
  console.log("获取原始编排参数:", res);
  if (res.code == 200) {
    orchestrationInfo.value = res.data;
  }
  console.log("123orchestrationInfo.value:",orchestrationInfo.value);
}

// 通过网络名称获取网络信息
const getNetworkByName = async()=>{
  const res = await apiGetNetworkByName(network.value)
  console.log('通过网络名称获取网络信息:',res)
  blockExplorerUrl.value = res.data.blockExplorerUrl
  rpcUrl.value = res.data.rpcUrl
  symbol.value = res.data.symbol
}

const goTranscationUrl = (transactionHash:any)=>{
  // url拼接/tx/0x856c4ac145ffe250e848ba6b7983cecab92224f85133ef477d6888f5179f3d26
  window.open(`${blockExplorerUrl.value}/tx/${transactionHash}`)
}

// 停止部署，执行引擎
const stop = ()=>{
  newEngine.stop()
}

// 重新部署，执行引擎
const reDeploy = async()=>{
  const executeId = route.query.executeId
  const projectId = route.query.id
  const res = await apiGetExecuteInfoById(projectId,executeId)
  if (res.code === 200) {
    let execJson:DeployRecord = JSON.parse(res.data.arrangeProcessData)
    const { data } = await apiGetProjectsContract({ id: projectId, version: route.query.version});
    const contractMap = formatContractList(data)
    const networkData = await apiGetNetworkByName(res.data.network)
    let deployParams = {
      projectId:projectId,
      execId: executeId,
      version: route.query.version,
      network: res.data.network,
      rpcUrl: networkData.data.rpcUrl
    }
    await newEngine.start(contractMap,execJson,deployParams)
    timeStop.value = false
    await getExecuteInfoById();
  }
}

const execDeploy = async () => {
  const executeId = route.query.executeId
  const projectId = route.query.id
  const res = await apiGetExecuteInfoById(projectId,executeId)
  if (res.code === 200) {
    let execJson:DeployRecord = JSON.parse(res.data.arrangeProcessData)
    const execStatus = execJson.deployStep.some(item => item && (item.status === "FAILED" || item.status === "STOP"))
    const allSuccess = execJson.deployStep.every(item => item && item.status === "SUCCESS")
    if (!execStatus && !allSuccess) {
      const { data } = await apiGetProjectsContract({ id: projectId, version: route.query.version});
      const contractMap = formatContractList(data)
      let deployParams = {
        projectId:projectId,
        execId: executeId,
        version: route.query.version,
        network: res.data.network,
      }
      newEngine.start(contractMap,execJson,deployParams)
    }
  }
}

watch(
  () => props.version,
  async (value) => {
    // 获取当前版本下的编排数据
    await getOriginalArrangeList();
  }, { deep: true, immediate: true }
);

onMounted(async () => {
  // 根据执行id获取执行信息
  await getExecuteInfoById();
  await getNetworkByName()
  await execDeploy()
});

onUnmounted(() => {
  clearTimeout(timer.value);
  newEngine.destroy()
})
</script>
<style scoped lang="less">

:deep(.ant-btn-primary) {
  width: 140px;
  height: 40px;
}
.svg-color{
  color: #E2B578;
}
.white-css{
  :deep(.ant-collapse){
    background: #FFFFFF;
    box-shadow: 3px 3px 12px 0px rgba(203,217,207,0.2);
    border: 1px solid #F8F8F8;
  }
  :deep(.ant-collapse > .ant-collapse-item){
    border-color: #EBEBEB;
  }
  :deep(.ant-collapse-content>.ant-collapse-content-box){
    background-color: #FFFFFF; 
  }
}
:deep(.ant-collapse){
  background-color: #36322D;
  border-color: #36322D; 
  border-radius: 12px;
}
:deep(.ant-collapse > .ant-collapse-item){
  border-color: #454545;
}
:deep(.ant-collapse>.ant-collapse-item>.ant-collapse-header){
  padding: 20px 20px;
}
:deep(.ant-collapse>.ant-collapse-item>.ant-collapse-header .ant-collapse-arrow){
  font-size: 16px;
  color: #E2B578;
}
:deep(.ant-collapse-content){
  border-top: none;
}
:deep(.ant-collapse-content>.ant-collapse-content-box){
  background-color: #36322D; 
  padding: 0 20px 20px 20px;
}
</style>
<style scoped>
.collapse-content-title{
  @apply text-[14px] text-[#73706E] dark:text-[#BBBAB9] font-medium mr-[20px] w-[170px] text-right;
}
</style>