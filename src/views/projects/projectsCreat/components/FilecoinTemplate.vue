<template>
    <div class="text-[24px] font-bold mb-2 w-[100%]">Contract Wizard</div>
    <div class="text-[14px] dark:text-[#E0DBD2] text-[#73706E] w-[100%]">
        Choose one of the programming languages supported by Filecoin to quickly develop your Filecoin smart contract.
    </div>
    <div class="mt-[32px] mb-[18px] font-bold w-[100%]">
        Plaase choose one of the programming languages :
    </div>
    <div class="template cursor-pointer" @click="goFilecoinDetail" style="border: 1px solid #E2B578;">
        <img src="@/assets/icons/solidity-b.svg" class="w-[48px] mt-[70px] hidden dark:inline-block"/>
        <img src="@/assets/icons/solidity-w.svg" class="w-[48px] mt-[70px] dark:hidden"/>
        <p class="font-bold mt-[20px]">Solidity</p>
        <div class="text-[14px]">
            Developers can benefit from the mature Ethereum development experience and easily build powerful decentralized storage applications
        </div>
    </div>
    <div class="template border border-solid border-[#EBEBEB] dark:border-[#434343]">
        <img src="@/assets/icons/rust-b.svg" class="w-[58px] mt-[60px] hidden dark:inline-block"/>
        <img src="@/assets/icons/rust-w.svg" class="w-[58px] dark:hidden mt-[60px]"/>
        <p class="font-bold mt-[20px]">Rust</p>
        <div class="text-[14px]">
            Rust's memory safety and performance advantages allow you to build fast, secure and scalable decentralized storage applications on Filecoin
        </div>
        <span class="future mt-[20px]">Coming soon</span>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const emit = defineEmits(["goFilecoinDetail"]);
const router = useRouter()
// 跳转Filecoin详情页
const goFilecoinDetail = () => {
    //   router.push('/projects/templates/details')
    emit('goFilecoinDetail')
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