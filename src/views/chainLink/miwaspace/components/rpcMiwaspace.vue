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

    <div class="ethereum-container">
      <div>
        <img src="@/assets/svg/miwaspace-eth.svg" class="h-6"/>
        <span class="ml-2 text-base font-bold align-middle">Ethereum</span>
      </div>
      <div class="flex justify-between text-sm">
        <div class="flex flex-col">
          <span class="inline-block mb-2.5 mt-5">Chain ID</span>
          <span class="self-center">1</span>
        </div>
        <div class="flex flex-col">
          <span class="inline-block mb-2.5 mt-5">Native Token</span>
          <span class="self-center">ETH</span>
        </div>
      </div>
      <div>
        <div class="my-5 text-sm">RPC URL</div>
        <a-input placeholder="Please input your RPC URL">
          <template #suffix>
            <img src="@/assets/svg/miwaspace-copy.svg" />
            <span class="text-[#E2B578] ml-1">Copy</span>
          </template>
        </a-input>
      </div>
      <a-button class="w-full mt-5 !h-[43px]">Get Service Now</a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .ethereum-container {
    width: 403px;
    height: 326px;
    padding: 30px;
    background: rgba(226,181,120,0.1);
    border-radius: 12px;
    border: 1px solid #EBEBEB;
  }
</style>