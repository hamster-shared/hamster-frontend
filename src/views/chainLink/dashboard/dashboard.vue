<template>
  <div class="dashboard dark:bg-[#1D1C1A] bg-[#FFFFFF]">
    <div class="font-bold text-[24px] mb-[8px]">My Middleware</div>
    <div class="grid grid-cols-3 gap-4 ">
      <div v-for="item in dashboardList" :key="item"
        class="border border-solid dark:border-[#434343] border-[#EBEBEB] rounded-[12px] p-[24px] dark:bg-[#36322D] bg-[#ffffff]">
        <div class="text-[16px] font-bold mb-[16px]">{{ item }}</div>

        <div v-if="RPCList.length && item === 'RPC'">
          <div v-for="val in RPCList" :key="val.id" class="box">
            <div class="name">{{ val.chain }}</div>
            <div class="network">{{ val.network }}</div>
            <div class="view" @click="networkClick(val)">View</div>
          </div>
          <div class="text-center mt-[18px] cursor-pointer text-[#E2B578]" @click="goRPC" v-if="RPCList.length>4">More</div>
        </div>
        <div v-else-if="isShowOracle && item === 'Oracle'">
          <div v-for="val in oracleList"
            class="flex justify-between pt-[6px] border-t-0 border-r-0 border-l-0 border-b border-solid dark:border-[#434343] border-[#F6F6F6] pb-[14px]">
            <div>{{val}}</div>
            <div class="cursor-pointer text-[#E2B578]" @click="oracleClick">View</div>
          </div>
        </div>
        <div v-else>
          <div class="text-center">
            <img src="@/assets/images/cl-noData-block.png" class="w-[128px] h-[128px] hidden dark:inline-block" />
            <img src="@/assets/images/cl-noData-white.jpg" class="w-[128px] h-[128px] dark:hidden" />
          </div>

          <div class="text-center mt-[12px] dark:text-[#8A8A8A] text-[#73706E]">The service has not been opened yet</div>
          <div class="text-center mt-[10px] text-[#E2B578] cursor-pointer" @click="goMiwaspaceTab(item)">Get service now</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup name="Dashboard">
import { ref,onMounted } from "vue";
import { useRouter } from "vue-router";
import { apiGetMynetwork } from '@/apis/rpcs'
import { apiGetIfOpenService } from '@/apis/middleWare'
const dashboardList = ref(['RPC', 'Oracle', 'Storage', 'Graph', 'ZKP', 'Others'])
const RPCList = ref<any>([]);
const router = useRouter();
// 用来记录跳转的具体页面
const index = ref()
// oracle是否开通服务
const isShowOracle = ref(false)
const oracleList = ref<any>([])
const networkClick = (val: any) => {
  console.log('networkClick',val)
  router.push(`/chainlink/RPC/rpc-detail/${val.chain}?network=${val.network}&fromDashboard=1`)
}
// more 跳转rpc
const goRPC = ()=>{
  router.push('/chainlink/RPC')
}

const oracleClick = () => {
  router.push('/chainlink/Oracle')
}
const getChains = async()=>{
  const params = {
    page:1,
    size:10
  }
  const res = await apiGetMynetwork(params)
  if(res.code===200 && res.data.length){
    console.log('getChains',res)
    RPCList.value = res.data.splice(0,5)
  }
}
// 开通服务跳转对应的miwaspace
const goMiwaspaceTab = (tab:any)=>{
  console.log('goMiwaspaceTab',tab)
  switch(tab) {
      case 'RPC':
        index.value = 1;
        break;
      case 'Oracle':
        index.value = 2;
        break;
      case 'Storage':
        index.value = 3;
        break;
      case 'Graph':
        index.value = 4;
        break;
      case 'ZKP':
        index.value = 5;
        break;
      case 'Others':
        index.value = 6;
        break;
      default: break;
    }
  router.push(`/chainlink/miwaspace?key=${index.value}`)
}
const openService = async()=>{
  const res = await apiGetIfOpenService('oracle')
  if(res.code === 200){
    isShowOracle.value = res.data.isActive
    oracleList.value = res.data.childList
  }
}
onMounted(()=>{
  getChains()
  openService()
})
</script>
<style scoped lang="less">
.box{
  border-bottom: 1px solid #434343;
}
.box div{
  margin: -5px;
  left: 5px;
}
.name{
  float: left;
  padding-top: 15px;
}
.network{
  display: flex;
  clear: both;
  flex-wrap: wrap;
  color: #ccc;
  font-weight: 100;
  padding-top: 10px;
  bottom: 5px;

}
.view{
  width: 50px;
  height: 40px;
  cursor: pointer;
  color:#E2B578; 
  text-align: right;
  float: right;
  top: -40px;
}
</style>