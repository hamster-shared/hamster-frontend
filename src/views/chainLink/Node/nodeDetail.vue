<template>
  <div class="box_11 flex-col">
    <bread-crumb :routes="breadCrumbInfo"/>
    <div class="borderbox flex-row  p-[30px] mt-[30px]">
      <span class="font_style2  mb-[30px] block dark:text-[#fff] text-[#151210]">{{ nodeDetailInfo.name }}</span>
      <div class="flex-row flex ">
        <div class="flex-col  flex">
          <span class="font_style3 font_color1">Region:</span>
          <span class="font_color2">{{ nodeDetailInfo.region }}</span>
        </div>
        <div class="flex-col flex">
          <span class="font_style3 font_color1">Launch Time:</span>
          <span class="font_color2">{{ dayjs(nodeDetailInfo.launchTime?.Time).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </div>
        <div class="flex-col flex">
          <span class="font_style3 font_color1">Running Time:</span>
          <span class="font_color2">{{ day+"d "+hour+"h "+min+"m "+seconds+"s "}}</span>
        </div>
      </div>
      <div class="flex-row flex mt-[20px]">
        <div class="flex-col flex ">
          <span class="font_style3 font_color1">Resource:</span>
          <span class="font_color2">{{ nodeDetailInfo.resource }}</span>
        </div>
        <div class="flex-col flex">
          <span class="font_style3 font_color1">Public IP:</span>
          <span class="font_color2">{{ nodeDetailInfo.publicIp }}</span>
        </div>
        <div class="flex-col flex">
          <span class="font_style3 font_color1">Next Payment Date:</span>
          <span class="font_color2">{{ dayjs(nodeDetailInfo.nextPaymentDate?.Time).format('YYYY-MM-DD')}}</span>
        </div>
      </div>
      <div class="flex flex-col mt-[20px]">
        <span class="font_style3 font_color1">Chain Version:</span>
        <span class="font_color2">{{ nodeDetailInfo.chainVersion }}</span>
      </div>
    </div>

  <div class="borderbox flex-row mt-[30px] mb-[30px] p-[30px]">
    <span class="font_style2 mb-[30px] block  dark:text-[#fff] text-[#151210]">Status Checks</span>
    <div class="flex-row flex ">
      <div class="flex-col flex  mb-[10px]">
        <span class="font_style3 font_color1">Node Status:</span>
        <span class="font_color2">{{ nodeDetailInfo.status }}</span>
      </div>
      <div class="flex-col flex  mb-[10px]">
        <span class="font_style3 font_color1">Current Height:</span>
        <span class="font_color2">{{ nodeDetailInfo.currentHeight }}</span>
      </div>
    </div>
    <div class="flex-row flex mt-[20px]">
      <div class="flex-col flex  mb-[10px]">
        <span class="font_style3 font_color1">Remaining Sync Time:</span>
        <span class="font_color2">{{ nodeDetailInfo.remainingSyncTime }}</span> 
      </div>
      <div class="flex-col flex  mb-[10px]">
        <span class="font_style3 font_color1">Block Time:</span>
        <span class="font_color2">{{ nodeDetailInfo.blockTime }}</span>
      </div>
    </div>
  </div>
      
  <div class="borderbox p-[30px]" v-if="nodeDetailInfo.httpEndpoint || nodeDetailInfo.websocketEndpoint">
    <span class="font_style2 block  mb-[30px]  dark:text-[#fff] text-[#151210]">API Details</span>
    <div v-if="nodeDetailInfo.httpEndpoint" class="flex-col flex  mb-[20px]">
      <span class="font_style3 font_color1">HTTP:</span>
      <div class="flex-row justify-between">
        <span class="font_color2">{{ nodeDetailInfo.httpEndpoint }}</span>
        <svg-icon name="copy" size="18" class="ml-[10px]" @click="copyToClipboard(nodeDetailInfo.httpEndpoint)"/>
      </div>
    </div>
    <div v-if="nodeDetailInfo.websocketEndpoint" class="flex-col flex ">
      <span class="font_style3 font_color1">WebSocket:</span>
      <div class="flex-row justify-between">
        <span class="font_color2">{{ nodeDetailInfo.websocketEndpoint }}</span>
        <svg-icon  name="copy" size="18" class="ml-[10px]" @click="copyToClipboard(nodeDetailInfo.websocketEndpoint)"/>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BreadCrumb from "@/components/BreadCrumb.vue";
import { apiNodeDetail } from '@/apis/chainlink'
import { useRoute } from "vue-router";
import{ copyToClipboard } from "@/utils/tool";
import dayjs from 'dayjs';

const route = useRoute()
const breadCrumbInfo = ref<any>([])
const nodeDetailInfo= ref<any>({})
const day =  dayjs(nodeDetailInfo.launchTime?.Time).format('D') 
const hour = dayjs(nodeDetailInfo.launchTime?.Time).format('h')
const min = dayjs(nodeDetailInfo.launchTime?.Time).format('m')
const seconds = dayjs(nodeDetailInfo.launchTime?.Time).format('s')

const changeStatus = (status:number)=>{
  switch(status) {
      case 1:
        nodeDetailInfo.value.status = "Initializing";
        break;
      case 2:
        nodeDetailInfo.value.status = "Launching";
        break;
      case 3:
        nodeDetailInfo.value.status ="Syncing";
        break;
      case 4:
        nodeDetailInfo.value.status = "Synced";
        break;
      case 5:
        nodeDetailInfo.value.status = "Halted";
        break;
      default: break;
    }
}
const getNodeDetailInfo = async ()=>{
  try {
    const { data } = await apiNodeDetail(route.query.id);
    nodeDetailInfo.value = JSON.parse(JSON.stringify(data));
    changeStatus(nodeDetailInfo.value.status)
    /* console.log(nodeDetailInfo,"nodeDetailInfo") */
  } catch (err) {
    console.log(err)
  }
}

onMounted(async() => {
await getNodeDetailInfo()

  breadCrumbInfo.value = [
    {
      breadcrumbName:'Node',
      path:'/middleware/dashboard/node'
    },
    {
      breadcrumbName: nodeDetailInfo.value.name,
      path:''
    },
  ]
})
</script>

<style lang="less" scoped>
.borderbox{
  border-radius: 12px;
  border: 1px solid #EBEBEB;
    .font_style{
    height: 24px;
    font-size: 18px;
    font-family: NotoSans-Regular, NotoSans;
    font-weight: 400;
    color: #E2B578;
    line-height: 24px;
  }
    .font_style2{
    height: 33px;
    font-size: 24px;
    font-family: NotoSans-Bold, NotoSans;
    font-weight: bold;
    // color: #FFFFFF;
    line-height: 33px;
  }
  .font_style3{
    height: 20px;
    font-size: 14px;
    font-family: NotoSans-Regular, NotoSans;
    font-weight: 400;
    color: #A0A0A0;
    line-height: 19px;
    width: 200px;
    //margin-top: 20px;
  }
  .font_style4{
    height: 22px;
    font-size: 16px;
    font-family: NotoSans-Regular, NotoSans;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
  }
}
html[data-theme='dark'] {
  .font_color1{
    color:  #A0A0A0;
  }
  .font_color2{
    color: #FFFFFF;
  }
  .borderbox{
    border-color: #434343;
  }
}
.font_color1{
  color: #73706E;
}
.font_color2{
  color: #151210;
}
</style>
  
  