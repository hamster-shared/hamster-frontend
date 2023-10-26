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
      The following contracts will be deployed on the {{ $route.query.selectNetworkName }}
    </div>
    <div v-if="executeArrange.length > 0">
      <a-collapse v-model:activeKey="activeKey">
        <a-collapse-panel  v-for="(item,index) in executeArrange" :key="index" :header="item.name" @click="">
          <template #extra>
            <div class="flex items-center">
              <div v-if="item.status === 'Failed'" class="text-[#E2B578] font-semibold mr-[20px]" @click="reDeploy">Redeploy</div>
              <img :src="getImageURL(`deploy${item.status}.png`)" class="h-[22px] mr-2" />
              <div>{{ item.status }}</div>
            </div>
          </template>
          <div class="bg-[#F6F6F6] dark:bg-[#191816]">
            <div v-if="Object.keys(item.transactionInfo).length > 0" class="p-[20px] flex justify-between">
              <div>
                <div class="flex items-center">
                  <div class="collapse-content-title">Transaction Hash:</div>
                  <div>{{ item.transactionInfo.transactionHash }}
                    <svg-icon name="copy" size="18" class="svg-color ml-2"  @click="copyToClipboard('')"/>
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
                    <svg-icon name="copy" size="18" class="svg-color ml-2"  @click="copyToClipboard('')"/>
                  </div>
                </div>
                <div class="flex items-center mt-[10px]">
                  <div class="collapse-content-title">To:</div>
                  <div>{{ item.transactionInfo.to }}
                    <svg-icon name="copy" size="18" class="svg-color ml-2"  @click="copyToClipboard('')"/>
                  </div>
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
                  <div class="collapse-content-title">Gas Price::</div>
                  <div>{{ item.transactionInfo.gasPrice }}</div>
                </div>
              </div>
              <div class="text-[#E2B578] text-[14px] font-semibold cursor-pointer">View on block explorer</div>
            </div>
            <div v-else class="text-[#666666] text-[18px] font-medium py-[70px] text-center">NO Data</div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
  <DeploymentOrchestrationmodal v-if="orchestrationInfo" :orchestrationInfo="orchestrationInfo" :showVisible="showOrchestrationInfo" @hideVisible="hideOrchestrationInfo" />
</template>
<script setup lang="ts">
import { onMounted, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import{ copyToClipboard } from "@/utils/tool";
import useAssets from "@/stores/useAssets";
import { useThemeStore } from "@/stores/useTheme";
import DeploymentOrchestrationmodal from "./DeploymentOrchestrationmodal.vue";
import { apiWaitContractList, apiGetExecuteInfoById } from '@/apis/contractOrchestrationDeploy';
import { getTransactionInfo } from "@/views/projects/projectsDeploymentOrchestration/components/utils/evm";

const props = defineProps({
  version:{
    type:String,
    default:''
  }
})
const emit = defineEmits(["execStop", "reDeploy"])
const { version } = toRefs(props)

const { getImageURL } = useAssets();
const theme = useThemeStore();
const route = useRoute()
const router = useRouter()
// 展示部署信息弹框
const showOrchestrationInfo = ref(false)
const orchestrationInfo = ref<any>();
//获取执行信息 
const executeArrange = ref<any>([]);

const activeKey = ref(['1']);
const actionVal = ref('All Action')
const actionOptions = ref([
  {label: 'View Dashboard', value: 'Dashboard'},
  {label: 'View Setting', value: 'Setting'},
]);
const deploymentList = ref<any>([
  {name: 'Contract A',id:'1',status:'Success',content: '123'},
  {name: 'Contract B',id:'2',status:'Failed',content: '123'},
  {name: 'Contract C',id:'3',status:'Wait'},
]);

const goPage = (val:string)=>{
  console.log('goPage', val)
  if(val=='Dashboard'){
    router.push(`/projects/projectsDashboard?id=${route.query.id}`)
  }else{
    showOrchestrationInfo.value = true
    // router.push(`/projects/projectsDeploySeting?id=${route.query.id}`)
  }
}
//隐藏弹框
const hideOrchestrationInfo = () => {
  showOrchestrationInfo.value = false;
}
// 根据执行id获取执行信息 
const getExecuteInfoById = async () => {
  const res = await apiGetExecuteInfoById(route.query.id, route.query.executeId);
  console.log("根据执行id获取执行信息:", res);
  if (res.code == 200) {
    setExecuteInfoList(JSON.parse(res.data.arrangeProcessData));
  }
}
//设置执行信息数据
const setExecuteInfoList = (arrangeData:any) => {
  arrangeData.deployStep.forEach(async (ele: any) => {
    if (Object.keys(ele).length > 0) {
      let proxy = ele.contract.proxy ? ' proxy' : '';
      let params = {
        name: ele.contract.name + proxy ,
        status: ele.status,
        transactionInfo: {},
      }
      if (ele.contract.transactionHash) {
        params.transactionInfo = await getTransactionInfo(ele.contract.transactionHash);
      }
      executeArrange.value.push(params);
      //遍历steps数组
      ele.steps.forEach(async (item: any) => {
        if (item.type == "function") {  
          params = {
            name: item.contractName + '.' + item.method,
            status: item.status,
            transactionInfo: {},
          }
          if (item.transactionHash) {
            params.transactionInfo = await getTransactionInfo(item.transactionHash);
          }
          executeArrange.value.push(params);
        }
      });
    }
  });
  console.log("executeArrange::",executeArrange.value);
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

// 停止部署，执行引擎
const stop = ()=>{
  emit('execStop')
}

// 重新部署，执行引擎
const reDeploy = ()=>{
  emit('reDeploy')
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
});
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