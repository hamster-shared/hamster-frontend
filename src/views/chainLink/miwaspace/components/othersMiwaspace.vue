<template>
  <div>
    <div class="mt-10 mb-5">
      <span class="text-2xl font-bold">Others</span>
      <div class="text-base w-[70%] mt-2">
        Hamster will also provide developers with web3 infrastructure middleware such as wallets and DIDs.
      </div>
    </div>

    <div class="others-container">
      <span class="text-base font-bold">Hamswallet</span>
      <div class="text-sm h-[100px] content overflow-y-auto">
        Hamwallet is an aggregated wallet framework that provides web3 developers with fast
        integration of multi-wallet connections and on-chain data management services. Hamwallet
        helps developers quickly build and scale web3 projects through rich wallet integration, visual
        interfaces and flexible configurations.
      </div>
      <a-button class="!h-[43px] w-[169px] !cursor-default">Coming Soon</a-button>
    </div>
    <div class="others-container">
      <span class="text-base font-bold">GoPlus Security</span>
      <div class="text-sm h-[100px] content">
        GoPlus provides open, unlicensed, user-driven security services and is committed to building
        the "security infrastructure" of web3. GoPlus ensures a safer web3 ecosystem by building a
        secure data infrastructure and security service platform.
      </div>
      <a-button class="!h-[43px] w-[169px] !cursor-default">Coming Soon</a-button>
    </div>
    <div class="others-container">
      <span class="text-base font-bold">Trusta</span>
      <div class="text-sm h-[100px] content">
        Trusta matches on-chain assets with suitable users. Using AI-driven witch attack prevention,
        knowledge graph enhanced analysis and user positioning, Trusta plays an important role in
        scenarios such as securing transactions and logins, and formulating airdrop strategies.
      </div>
      <a-button class="!h-[43px] w-[169px] !cursor-default">Coming Soon</a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .others-container {
    display: inline-block;
    margin-right: 20px;
    width: 456px;
    height: 216px;
    padding: 5px 30px;
    background: rgba(226,181,120,0.1);
    border-radius: 12px;
    border: 1px solid #EBEBEB;
    margin-top: 20px;
  }
  .content{
    margin: 10px 0;
  }
</style>