<template>
  <div>
    <div class="my-10">
      <span class="text-2xl font-bold">Oracle</span>
      <div class="text-base mt-2" style="text-align: justify; text-justify: inter-word;">
        The Oracle is the messenger for the interaction between the blockchain and the real world data. 
        It is an indispensable infrastructure for the web3 ecology, 
        and its development plays a vital role in the prosperity of the web3 ecology. 
        In order to allow developers to quickly access more suitable oracle services with zero code or low code, 
        the Hamster platform aggregates various oracle solution middleware on the market.
      </div>
    </div>

    <div class="border border-[#EBEBEB] border-solid rounded-xl p-10">
      <div>
        <span class="text-[#E2B578] font-bold text-2xl">Chainlink</span>
        <div class="text-base text-[#73706E] mt-2.5" style="text-align: justify; text-justify: inter-word;">The decentralized oracle network was proposed by (DON) Chainlink. 
          This method not only enhances data reliability, but also endows the oracle with computing power, 
          greatly enhancing the usage scenarios of the oracle.
        </div>
      </div>

      <div class="relative oracle-container">
        <span class="text-base font-bold">Hamslink</span>
        <div class="text-sm h-[110px] content overflow-y-auto">
          Chainlink Functions is a web3 serverless development platform that allows you to fetch data from any API and perform 
          custom computations on Chainlink's highly secure and reliable network. However, Chainlink Functions operations are relatively complex, the
          visual interface is insufficient, and a certain level of coding ability is required. To simplify
          Chainlink Functions operations and allow more developers to easily access Chainlink
          Functions services, Hamster has integrated and developed a Chainlink Functions service
          middleware.
        </div>
        <div class="mt-4">
          <a-button class="!h-[43px] w-[169px]" v-if="openService" @click="router.push('/middleware/dashboard/oracle')">Enter Now</a-button>
          <a-button class="!h-[43px] w-[169px]" v-else @click="handleOpenService">Get Service Now</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, toRefs } from 'vue'
  import { useRouter } from 'vue-router';
  import { apiPostCustomerOpenService } from '@/apis/middleWare'

  const router = useRouter()
  const props = defineProps({
    openService:Array
  })
  const { openService } = toRefs(props)

  const showMore = ref(false)

  // 为用户开通服务
  const handleOpenService = async()=> {
    try {
      const params = {
        chain:'',
        network:''
      }
      const { data } = await apiPostCustomerOpenService('oracle',params)
      console.log('handleOpenService-data:', data)
      router.push('/chainlink/oracle')
    } catch(err:any) {
      console.log('handleOpenService-err:', err)
    }
  }
</script>

<style lang="less" scoped>
  .oracle-container {
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