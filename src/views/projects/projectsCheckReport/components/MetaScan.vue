<template>
  <div class="bg-css rounded-[12px] relative mt-[24px]">
    <img src="@/assets/images/metatrust-bg-logo.png" class="w-[260px] max-w-fit absolute right-0 bottom-0" />
    <div class="flex justify-between">
      <div class="font-bold text-[24px] mb-[45px]">{{metatrustInfo.title}}</div>
      <a-button type="link" class="view-detail-btn" style="font-size: 16px;" @click="goMetaScan">View More</a-button>
    </div>
    <div class="text-[18px]">{{metatrustInfo.description}}</div>
    <div v-if="metatrustInfo.content?.length" class="mt-[20px] text-[#73706E] dark:text-[#B4AFAD] flex" v-for="(item,key) in metatrustInfo.content" :key="key">
      <div class="text-[#F97315] text-[80px] leading-[5px] mr-1">·</div>
      <div>{{item}}</div>
    </div>
    <div class="font-medium mt-[40px]">
      Powered by
      <img src="@/assets/icons/Metatrust-logo.svg" class="h-[42px] ml-2" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, ref, toRefs, onMounted } from 'vue';
import { getMetatrustInfoByToolname } from '@/utils/metatrust'
const props = defineProps({
  checkType:{
    type: String,
    default:''
  }
})
const name = ref()
const metatrustInfo = ref<any>({})
const { checkType } = toRefs(props)
const goMetaScan = ()=>{
  window.open('https://metatrust.io/')
}
onMounted(()=>{
  if(checkType.value=='MetaTrust (SA)'){
    name.value = 'MetaTrust Security Analyzer'
  }else if(checkType.value=='MetaTrust (SP)'){
    name.value = 'MetaTrust Security Prover'
  }else if(checkType.value=='MetaTrust (OSA)'){
    name.value = 'MetaTrust Open Source Analyzer'
  }else if(checkType.value=='MetaTrust (CQ)'){
    name.value = 'MetaTrust Code Quality'
  }else{
    name.value = checkType.value
  }
  metatrustInfo.value = getMetatrustInfoByToolname(name.value)
  console.log(metatrustInfo,'checkType~~~~~~~~',checkType.value)
})
</script>
<style scoped lang="less">
.bg-css{
  background: linear-gradient(135deg, #FFFBF7 0%, #FFF0E4 100%);
  padding: 37px 32px;
}
html[data-theme='dark'] {

  .bg-css{
    background: linear-gradient(135deg, #4A2F0A 0%, #430E0D 100%);
  }
}
</style>