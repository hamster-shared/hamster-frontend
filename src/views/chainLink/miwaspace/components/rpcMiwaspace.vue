<template>
  <div>
    <div class="my-10">
      <span class="text-2xl font-bold">RPC</span>
      <div class="text-base mt-2" style="text-align: justify; text-justify: inter-word;">
        Web3 development is inseparable from the support of blockchain nodes, 
        and building and maintaining nodes requires a lot of cost and effort. 
        In order to enable developers to obtain efficient and stable node services, 
        Miwaspace provides RPC services to meet the development needs of developers for various ecological projects.
      </div>
    </div>

    <div class="grid gap-[10px] " :style="styleVal">
      <div class="ethereum-container" v-for="(item,index) in rpcPageInfo" :key="index">
        <div class="flex justify-between items-center mb-[50px]">
          <div>
            <img :src="item.ecosystemIcon" class="h-[42px] "/>
            <span class="ml-[10px] text-[18px] font-bold align-middle">{{item.ecosystemName}}</span>
          </div>
          <div class="ml-[20px] text-[14px] font-medium">{{ item.ecosystemCode }}</div>
        </div>
        <a-button class="w-full !h-[43px]" @click="handleOpenRpcService(item.buyFlag)">{{ item.buyFlag ? 'View more' : 'Start for Free' }}</a-button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
  import { toRefs, onMounted,ref,watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { apiGetZanUserAuthed, apiGetZanAuthUrl } from "@/apis/middlewareRPC"

  const router = useRouter()
  const props = defineProps({
    rpcPageInfo:Array
  })
  const { rpcPageInfo } = toRefs(props)

const screenWidth = ref<any>(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
const styleVal = ref<any>('');
const openAppModal = async () => {
  const authedData = await apiGetZanUserAuthed()
  if(authedData.data){
      router.push('/middleware/dashboard/RPC/home')
  }else {
      let url = ""
      try{
        const authUrlResp = await apiGetZanAuthUrl()
        url = authUrlResp.data
      }catch (e) {
          return
      }
      const myWindow = window.open(url, 'login-zan', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
      myWindow?.focus()
      // router.push(`/middleware/dashboard/rpc/zan/auth?authCode=${}`)
      // router.push('/middleware/dashboard/RPC/home')
  }
}

// 开通rpc需要调接口
const handleOpenRpcService = async(buyFlag:boolean)=>{
  if(buyFlag){
    router.push(`/middleware/dashboard/RPC/home`);
  }else{
    openAppModal()
  }
}
const setStyleVal = () => {
  if (parseInt(screenWidth.value) < 1400) {
    styleVal.value = "grid-template-columns: repeat(2, minmax(0, 1fr));";
  } else {
    styleVal.value = "grid-template-columns: repeat(3, minmax(0, 1fr));";
  }
}
onMounted(() => {
  setStyleVal();
  window.onresize = () => {
    return (() => {
      screenWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      setStyleVal();
    })()
  }
});
</script>

<style scoped>
  .ethereum-container {
    @apply dark:bg-[#10100F];
    /* display: inline-block; */
    /* // height: 326px; */
    /* min-width: 400px; */
    padding: 30px;
    background: #F3F3F3;
    border-radius: 12px;
    /* margin: 10px; */
    border: 1px solid transparent;
  }
  .ethereum-container:hover{
    border: 1px solid #E2B578;
  }
</style>