<template>

  <div class="template cursor-pointer" @click="goSolanacoinDetail" style="border: 1px solid #E2B578;">
    <img src="@/assets/icons/solana-logo.png" class="w-[48px] mt-[20px] hidden dark:inline-block"/>
    <img src="@/assets/icons/solana-logo-light.png" class="w-[48px] mt-[70px] dark:hidden"/>
    <p class="font-bold mt-[20px]">NFT Collection Contract</p>
    <div class="text-[14px]">
      Create collection of unique NFTs.
    </div>
  </div>
<!--  <div class="template border border-solid border-[#EBEBEB] dark:border-[#434343]">-->
<!--    <img src="@/assets/icons/rust-b.svg" class="w-[58px] mt-[60px] hidden dark:inline-block"/>-->
<!--    <img src="@/assets/icons/rust-w.svg" class="w-[58px] dark:hidden mt-[60px]"/>-->
<!--    <p class="font-bold mt-[20px]">Rust</p>-->
<!--    <div class="text-[14px]">-->
<!--      Rust's memory safety and performance advantages allow you to build fast, secure and scalable decentralized storage applications on Filecoin-->
<!--    </div>-->
<!--    <span class="future mt-[20px]">Coming soon</span>-->
<!--  </div>-->
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const emit = defineEmits(["goSolanacoinDetail"]);
const router = useRouter()
// 跳转Filecoin详情页
const goSolanacoinDetail = () => {
  //   router.push('/projects/templates/details')
  emit('goSolanacoinDetail')
}
</script>
<style scoped lang="less">
.template{
  text-align: center;
  padding:20px;
  width: 100%;
  // height: 300px;
  margin-bottom: 16px;
  border-radius: 12px;
  // &:hover{
  //     border: 1px solid #E2B578;
  // }
  .future{
    display: inline-block;
    text-align: center;
    width: 112px;
    height: 25px;
    border-radius: 32px;
    border: 1px solid #EBEBEB;
  }
}
</style>
