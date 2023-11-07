<template>
  <div>
    <div class="mt-10 mb-5">
      <span class="text-2xl font-bold">Storage</span>
      <div class="text-base mt-2" style="text-align: justify; text-justify: inter-word;">
        The concept of web3 is decentralization, and data sovereignty belongs to users. 
        Decentralized storage solutions are the requirements of web3 users, 
        and will eventually become the best choice for web3 developers. 
        In order to allow web3 developers to quickly and cost-effectively access suitable decentralized solutions, 
        Hamster The platform aggregates various decentralized solutions on the market.
      </div>
    </div>

    <div class="storage-container">
      <span class="text-base font-bold">Filecoin</span>
      <div class="text-sm h-[110px] content">
        Filecoin is a decentralized storage network. Through an open and autonomous responsible
        storage network, it provides users with secure, private and affordable decentralized data
        storage solutions. It has strong technical advantages and broad application prospects.
      </div>
      <a-button class="!h-[43px] w-[169px] !cursor-default">Coming Soon</a-button>
    </div>
    <div class="storage-container">
      <span class="text-base font-bold">BNB Greenfield</span>
      <div class="text-sm h-[110px] content overflow-y-auto">
        BNB Greenfield is a decentralized storage platform. As a sidechain of BSC, it aims to
        establish a new data economy and facilitate the improvement and development of web3
        infrastructure. It has unique designs and advantages in semantics, redundant backups,
        file repair, storage costs, smart contracts, data access control, etc
      </div>
      <a-button class="!h-[43px] w-[169px] !cursor-default">Coming Soon</a-button>
    </div>
    <div class="storage-container">
      <span class="text-base font-bold">CESS</span>
      <div class="text-sm h-[110px] content">
        CESS is a decentralized cloud storage network for online data storage and real-time
        sharing. By providing smart contracts, DeOSS services and tools, CESS can easily access
        dApps, enabling both enterprise and individual users to easily achieve secure data
        storage, sharing and transactions.
      </div>
      <a-button class="!h-[43px] w-[169px] !cursor-default">Coming Soon</a-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .storage-container {
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