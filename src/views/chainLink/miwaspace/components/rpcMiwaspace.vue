<template>
  <div>
    <div class="my-10">
      <span class="text-2xl font-bold">RPC</span>
      <div class="text-base w-[70%] mt-2">
        Web3 development is inseparable from the support of blockchain nodes, 
        and building and maintaining nodes requires a lot of cost and effort. 
        In order to enable developers to obtain efficient and stable node services, 
        Miwago provides RPC services to meet the development needs of developers for various ecological projects.
      </div>
    </div>

    <div>
      <div class="ethereum-container" v-for="(item,index) in rpcPageInfo" :key="index">
        <div>
          <img :src="item.image" class="h-6"/>
          <span class="ml-2 text-base font-bold align-middle">{{item.fullname}}</span>
        </div>
        <div class="flex justify-between text-sm">
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
              <!-- <span v-if="item.httpAddress" class="cursor-pointer text-[#E2B578] pl-1" @click="copyInfo(item.httpAddress)">Copy</span> -->
            </template>
          </a-input>
        </div>
        <a-button class="w-full mt-5 !h-[43px]" @click="handleOpenRpcService(item.name,item.network,item.userActive)">{{item.userActive ? 'Enter Now':'Get Service Now'}}</a-button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
  import { toRefs, onMounted,ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { apiPostCustomerOpenService } from '@/apis/middleWare'
  import type { projectsParams } from "@/apis/utils/chainlinkInterface";

  const router = useRouter()
  const props = defineProps({
    rpcPageInfo:Array
  })
  const { rpcPageInfo } = toRefs(props)

  const copyInfo = async (_items: any) => {
  let inp = document.createElement("input");
  document.body.appendChild(inp);
  inp.value = _items;
  inp.select();
  document.execCommand("copy", false);
  inp.remove();
  message.success('copy success')
}
// 开通rpc需要调接口
const handleOpenRpcService = async(chain:string,network:string,userActive:boolean)=>{
  if(userActive){
    // 跳rpc-detail
    router.push(`/chainlink/RPC/rpc-detail/${chain}`)
  }else{
    // 跳rpc的折线图
    try {
      const params:projectsParams = {
        chain:chain,
        network:network
      }
      const { data } = await apiPostCustomerOpenService('rpc',params)
      console.log('handleOpenRpcService-data:', data)
      router.push('/chainlink/rpc')
    } catch(err:any) {
      console.log('handleOpenRpcService-err:', err)
    }
  }
}

</script>

<style lang="less" scoped>
  .ethereum-container {
    display: inline-block;
    height: 326px;
    min-width: 300px;
    padding: 30px;
    background: rgba(226,181,120,0.1);
    border-radius: 12px;
    border: 1px solid #EBEBEB;
    margin: 10px;
  }
</style>