<template>
  <div class="bg-css rounded-[12px] relative mt-[24px]">
    <img src="@/assets/images/metatrust-bg-logo.png" class="w-[260px] max-w-fit absolute right-0 bottom-0" />
    <div class="flex justify-between">
      <div class="font-bold text-[24px] mb-[45px]">MetaScan - Security Analyzer</div>
      <a-button type="link" class="view-detail-btn" style="font-size: 16px;" @click="goMetaScan">View More</a-button>
    </div>
    <div class="text-[18px]">Security analyzer is an automatic static analysis tool for detecting smart contract vulnerabilities. In this tool, we adopted the context-sensitive, flow-sensitive, money-sensitive technologies to conduct static analysis.</div>
    <div class="mt-[20px] text-[#73706E] dark:text-[#B4AFAD] flex">
      <div class="text-[#F97315] text-[80px] leading-[5px] mr-1">·</div>
      <div >Collected the almost-known vulnerable smart contracts,and analyzed how these vulnerabilities happened</div>
    </div>
    <div class="font-medium mt-[40px]">
      Powered by
      <img src="@/assets/icons/Metatrust-logo.svg" class="h-[42px] ml-2" />
    </div>
  </div>
</template>
<script setup lang="ts">
const goMetaScan = ()=>{
  window.open('https://metatrust.io/')
}
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