<template>
  <div>
    <div class="text-[24px] font-bold mb-[30px]">Billing</div>
    <div class="border border-solid border-[#EBEBEB] rounded-[12px] dark:border-[#434343] p-[30px]">
      <div class="text-[36px] font-black text-[#E2B578] text-center mt-[20px]">Your Plan</div>
      <div class="text-[21px] text-center mb-[50px]">Manage your subscription</div>
      <div class="grid grid-cols-3 gap-[10px]">
        <div class="card-div">
          <div class="card-title">Usage</div>
          <div class="card-content">
            <div>
              <label class="sub-title">Credit:</label>
              <label class="font-bold">{{ setNumberValue(userPlan.usedCredit) }}</label>
              <label class="font-light" v-if="userPlan.totalCredit"> / {{ setNumberValue(userPlan.totalCredit) }}</label>
            </div>
            <div class="mt-[20px]">
              <label class="sub-title">API Keys:</label>
              <label class="font-bold">{{ userPlan.createdApiKeyAmount }}</label>
              <label class="font-light"> / {{ userPlan.apiKeyAmount }} keys</label>
            </div>
          </div>
        </div>
        <div class="card-div">
          <div class="card-title">Free</div>
          <div class="card-content relative">
            <div v-if="userPlan.totalCredit">
              <label class="font-bold">· {{ setMillionValue(userPlan.totalCredit.toString()) }}</label>
              <label class="font-light"><label v-if="userPlan.totalCredit.toString().length > 6"> million</label> credits/mo</label><!--million-->
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· {{ userPlan.creditLimit }}</label>
              <label class="font-light"> credits/s (Rate Limites)</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· {{ userPlan.apiKeyAmount }}</label>
              <label class="font-light"> API keys</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· </label>
              <label class="font-light"> Archive data access</label>
            </div>
            <div class="absolute bottom-[30px] left-[30px] right-[30px]">
              <a-button type="primary" class="!h-[42px] !w-full ">Upgrade</a-button>
            </div>
          </div>
        </div>
        <div class="card-div">
          <div class="card-title">Billing & Payment</div>
          <div class="card-content">
            <div>
              <label class="sub-title">Price:</label>
              <label class="font-bold">—</label>
            </div>
            <div class="mt-[20px]">
              <label class="sub-title">Periods:</label>
              <label class="font-bold">—</label>
            </div>
            <div class="mt-[20px]">
              <label class="sub-title">Available until:</label>
              <label class="font-bold">{{ formatDateToLocale(userPlan.expireTime).format("YYYY/MM/DD HH:mm:ss") }}</label>
            </div>
            <div class="mt-[20px]">
              <label class="sub-title">Payment Method:</label>
              <label class="font-bold">—</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { formatDateToLocale } from '@/utils/dateUtil';
import { setMillionValue, setNumberValue } from './components/rpcData'
import { apiGetZanUserAuthed, apiZanPlan } from "@/apis/middlewareRPC";

const userPlan = ref<any>([]);
// 获取plan里面的字段信息
const getZanPlan = async () => {
  const authedData = await apiGetZanUserAuthed();
  if(authedData.data){
    let res = await apiZanPlan();
    if (res.code == 200) {
      userPlan.value = res.data
    }
  }
  console.log("userPlan:", userPlan.value);
}
onMounted(() => {
  getZanPlan();
});
</script>
<style scoped>
.card-div{
  /* display: inline-block; */
  /* margin: 10px; */
  margin-top: 10px;
  margin-bottom: 10px;
  /* min-width: 200px;
  width: 32%; */
  vertical-align: top;
  border-radius: 12px;
  border: 1px solid transparent;
}
.card-div:hover{
  border: 1px solid #E2B578;
}
.card-title{
  @apply bg-[#E2B578] h-[80px] leading-[80px] text-center text-[#FFFFFF] text-[24px] font-black;
  border-radius: 12px 12px 0 0;
}
.card-content{
  @apply bg-[#F3F3F3] dark:bg-[#10100F] p-[30px] h-[320px];
  border-radius: 0 0 12px 12px;
}
.sub-title{
  @apply dark:text-[#A0A0A0] text-[#73706E] mr-[10px];
}
</style>