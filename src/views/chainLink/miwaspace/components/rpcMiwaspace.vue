<template>
  <div>
    <div class="my-10">
      <span class="text-2xl font-bold">RPC</span>
      <div class="text-base mt-2" style="text-align: justify; text-justify: inter-word;">
        Web3 development is inseparable from the support of blockchain nodes, 
        and building and maintaining nodes requires a lot of cost and effort. 
        In order to enable developers to obtain efficient and stable node services, 
        Miwago provides RPC services to meet the development needs of developers for various ecological projects.
      </div>
    </div>

    <div>
      <div class="ethereum-container" v-for="(item,index) in rpcPageInfo" :key="index">
        <div class="flex justify-between items-center mb-[100px]">
          <div>
            <img :src="item.ecosystemIcon" class="h-[50px] "/>
            <span class="ml-[20px] text-[21px] font-bold align-middle">{{item.ecosystemName}}</span>
          </div>
          <div class="ml-[20px] text-[18px] font-medium">{{ item.ecosystemCode }}</div>
        </div>
        <a-button class="w-full !h-[43px]" @click="handleOpenRpcService(item.buyFlag)">{{ item.buyFlag ? 'View more' : 'Start for Free' }}</a-button>
        <!-- <div class="flex justify-between text-sm">
          <div class="flex flex-col" v-if="parseInt(item.chainID, 16)">
            <span class="inline-block mb-2.5 mt-5">Chain ID</span>
            <span class="self-center">{{ parseInt(item.chainID, 16) }}</span>
          </div>
          <div class="flex flex-col">
            <span class="inline-block mb-2.5 mt-5">Currency</span>
            <span class="self-center">{{ item.nativeToken }}</span>
          </div>
        </div>
        <div>
          <div class="my-5 text-sm">RPC URL</div>
          <a-input placeholder="*********" v-model:value="item.httpAddress" disabled="true">
            <template #suffix>
              <img v-if="item.httpAddress" class="cursor-pointer" src="@/assets/svg/miwaspace-copy.svg" @click="copyInfo(item.httpAddress)"/>
              <span v-if="item.httpAddress" class="cursor-pointer text-[#E2B578] pl-1" @click="copyInfo(item.httpAddress)">Copy</span>
            </template>
          </a-input>
        </div>
        <a-button class="w-full mt-5 !h-[43px]" @click="handleOpenRpcService(item.name,item.network,item.userActive)">{{item.userActive ? 'Enter Now':'Get Service Now'}}</a-button> -->
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
  import { toRefs, onMounted,ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { apiGetZanUserAuthed, apiGetZanAuthUrl } from "@/apis/middlewareRPC"

  const router = useRouter()
  const props = defineProps({
    rpcPageInfo:Array
  })
  const { rpcPageInfo } = toRefs(props)

const openAppModal = async () => {
  const authedData = await apiGetZanUserAuthed()
  if(authedData.data){
      // message.info("已经授权")
      router.push('/middleware/dashboard/RPC/home')
  }else {
      // message.info("jump to zan to auth")
      let url = ""
      try{
        const authUrlResp = await apiGetZanAuthUrl()
        url = authUrlResp.data
      }catch (e) {
          return
      }
      const myWindow = window.open(url, 'login-zan', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
      myWindow?.focus()
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

</script>

<style scoped>
  .ethereum-container {
    @apply dark:bg-[#10100F];
    display: inline-block;
    /* // height: 326px; */
    min-width: 400px;
    padding: 30px;
    background: #F3F3F3;
    border-radius: 12px;
    margin: 10px;
    border: 1px solid transparent;
  }
  .ethereum-container:hover{
    border: 1px solid #E2B578;
  }
</style>