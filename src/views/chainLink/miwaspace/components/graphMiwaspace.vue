<template>
  <div>
    <div class="mt-10 mb-5">
      <span class="text-2xl font-bold">Graph</span>
      <div class="text-base mt-2" style="text-align: justify; text-justify: inter-word;">
        Data sharing on the blockchain can be queried and obtained by everyone, 
        but directly accessing the target data on the blockchain usually requires a lot of energy and cost for developers, 
        which is not advisable for development work. 
        In order to allow developers to obtain and use data on the chain more friendly, 
        Miwago integrates various excellent data solutions on the market.
      </div>
    </div>

    <div class="graph-container">
      <span class="text-base font-bold">SubQuery</span>
      <div class="text-sm h-[110px] content">
        SubQuery is an Open, Flexible, Fast and Universal data indexing framework
        for web3.Not only can you obtain stable and efficient multi-chain data
        indexing services through SubQuery, but you can also quickly build your
        own data APIs.
      </div>
      <a-button class="!h-[43px] w-[169px] !cursor-default">Coming Soon</a-button>
    </div>
    <div class="graph-container">
      <span class="text-base font-bold">KNN3</span>
      <div class="text-sm h-[110px] content">
        KNN3 Network is a one-stop Web3 User-centric DataFi solution for d/Apps
        and smart contracts. KNN3 allows d/Apps & smart contracts to interact with
        cross-platform user-centric data in multiple algo-friendly ways.
      </div>
      <a-button class="!h-[43px] w-[169px] !cursor-default">Coming Soon</a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .graph-container {
    display: inline-block;
    margin-right: 20px;
    width: 456px;
    height: 266px;
    padding: 30px;
    background: rgba(226,181,120,0.1);
    border-radius: 12px;
    border: 1px solid #EBEBEB;
    margin-top: 20px;
  }
  .content{
    margin: 10px 0;
  }
</style>