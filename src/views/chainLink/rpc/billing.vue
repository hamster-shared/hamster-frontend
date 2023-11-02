<template>
  <div>
    <div class="text-[24px] font-bold mb-[30px]">Billing</div>
    <div class="border border-solid border-[#EBEBEB] rounded-[12px] dark:border-[#434343] p-[30px]">
      <div class="text-[36px] font-black text-[#E2B578] text-center mt-[20px]">Your Plan</div>
      <div class="text-[21px] text-center mb-[50px]">Manage your subscription</div>
      <div class="">
        <div class="card-div">
          <div class="card-title">Usage</div>
          <div class="card-content">
            <div>
              <label class="sub-title">Credit:</label>
              <label class="font-bold">0</label>
              <label class="font-light"> / 300,000,000</label>
            </div>
            <div class="mt-[20px]">
              <label class="sub-title">API Keys:</label>
              <label class="font-bold">1</label>
              <label class="font-light"> / 3 keys</label>
            </div>
          </div>
        </div>
        <div class="card-div">
          <div class="card-title">Free</div>
          <div class="card-content">
            <div>
              <label class="font-bold">· 300</label>
              <label class="font-light"> million credits/mo</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· 300</label>
              <label class="font-light"> credits/s (Rate Limites)</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· 3</label>
              <label class="font-light"> API keys</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· </label>
              <label class="font-light"> Archive data access</label>
            </div>
            <a-button type="primary" class="!h-[42px] !w-full mt-[50px]">Upgrade</a-button>
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
              <label class="font-bold">2023/10/12 00:00:00</label>
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

</script>
<style scoped>
.card-div{
  display: inline-block;
  margin: 10px;
  min-width: 250px;
  width: 31%;
  vertical-align: top;
  border-radius: 12px;
}
.card-div:hover{
  border: 1px solid #E2B578;
}
.card-title{
  @apply bg-[#E2B578] h-[50px] leading-[50px] text-center text-[#FFFFFF];
  border-radius: 12px 12px 0 0;
}
.card-content{
  @apply bg-[#F3F3F3] dark:bg-[#10100F] p-[30px] h-[300px];
  border-radius: 0 0 12px 12px;
}
.sub-title{
  @apply dark:text-[#A0A0A0] text-[#73706E] mr-[10px];
}
</style>