<template>
  <div>
    <div class="text-[24px] font-bold mb-[30px]">Pricing</div>
    <div class="border border-solid border-[#EBEBEB] rounded-[12px] dark:border-[#434343] p-[30px]">
      <div class="text-[36px] font-black text-[#E2B578] text-center mt-[20px]">Price Plan</div>
      <div class="text-[21px] text-center mb-[50px]">Hamster offers various plans for subscription. Choose the one that suits your needs.</div>
      <div class="">
        <div class="card-div">
          <div>
            <div class="card-title">Free</div>
            <div class="mb-[30px]">
              <label class="sub-title">$0</label>
              <label class="sub-title2"> / mo</label>
            </div>
            <div>
              <label class="font-bold">· 300</label>
              <label class="font-light"> million credits/mo</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· 300</label>
              <label class="font-light"> credits/s</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· 3</label>
              <label class="font-light"> API keys</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· </label>
              <label class="font-light"> Archive data access</label>
            </div> 
            <div class="mt-[20px]">
              <label class="font-bold">· </label>
              <label class="font-light"> Community Support</label>
            </div>
            <a-button type="primary" class="!h-[42px] !w-full mt-[30px]" disabled="true">Start for free</a-button>
          </div>
        </div>
        <div class="card-div relative">
          <img src="@/assets/images/save15.png" class="absolute top-[8px] right-[6px] h-[31px]" />
          <div>
            <div class="card-title">Premium</div>
            <div class="mb-[30px]">
              <label class="sub-title">$42</label>
              <label class="sub-title2"> / mo</label>
            </div>
            <div>
              <label class="font-bold">· 500</label>
              <label class="font-light"> million credits/mo</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· 700</label>
              <label class="font-light"> credits/s</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· 10</label>
              <label class="font-light"> API keys</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· </label>
              <label class="font-light"> Archive data access</label>
            </div> 
            <div class="mt-[20px]">
              <label class="font-bold">· </label>
              <label class="font-light"> 24h Response</label>
            </div>
            <div class="mt-[30px] text-[14px] text-[#E2B578] bg-[rgba(226,181,120,0.1)] rounded-[8px] h-[43px] leading-[43px] w-full text-center">Coming soon</div>
          </div>
        </div>
        <div class="card-div relative">
          <img src="@/assets/images/save15.png" class="absolute top-[8px] right-[6px] h-[31px]" />
          <div>
            <div class="card-title">Pro</div>
            <div class="mb-[30px]">
              <label class="sub-title">$254</label>
              <label class="sub-title2"> / mo</label>
            </div>
            <div>
              <label class="font-bold">· 300</label>
              <label class="font-light"> million credits/mo</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· 1800</label>
              <label class="font-light"> credits/s</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· 30</label>
              <label class="font-light"> API keys</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· </label>
              <label class="font-light"> Archive data access</label>
            </div> 
            <div class="mt-[20px]">
              <label class="font-bold">· </label>
              <label class="font-light"> 18h Response</label>
            </div>
            <div class="mt-[30px] text-[14px] text-[#E2B578] bg-[rgba(226,181,120,0.1)] rounded-[8px] h-[43px] leading-[43px] w-full text-center">Coming soon</div>
          </div>
        </div>
        <div class="card-div">
          <div>
            <div class="card-title">Enterprise</div>
            <div class="mb-[30px]">
              <label class="sub-title">Custom</label>
            </div>
            <div>
              <label class="font-bold">· Custom</label>
              <label class="font-light"> million credits/mo</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· Custom</label>
              <label class="font-light"> credits/s</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· Unlimited</label>
              <label class="font-light"> API keys</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· Custom</label>
              <label class="font-light"> SLA</label>
            </div>
            <div class="mt-[20px]">
              <label class="font-bold">· </label>
              <label class="font-light"> 18h Response</label>
            </div>
            <div class="mt-[30px] text-[14px] text-[#E2B578] bg-[rgba(226,181,120,0.1)] rounded-[8px] h-[43px] leading-[43px] w-full text-center">Coming soon</div>
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
  @apply bg-[#F3F3F3] dark:bg-[#10100F] p-[30px] ;
  display: inline-block;
  margin: 10px;
  min-width: 230px;
  width: 23%;
  vertical-align: top;
  border-radius: 12px;
  border: 1px solid transparent;
}
.card-div:hover{
  border: 1px solid #E2B578;
}
.card-title{
  @apply font-black text-[18px] text-[#E2B578] mt-[15px];
}
.sub-title{
  @apply text-[30px] font-black;
}
.sub-title2{
  @apply text-[18px] text-[#707070];
}
</style>