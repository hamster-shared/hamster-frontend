<template>
  <div>
    <div class="my-10">
      <div :class="{'grid grid-cols-3' : pageType !== 'create'}">
        <div class="rounded-[12px] mr-[30px] p-[30px] text-[#151210] dark:text-[#FFFFFF]" :class="[pageType === 'create' ? 'border border-solid border-[#EBEBEB] dark:border-[#434343]' : theme.themeValue === 'dark' ? 'col-span-2 dark:bg-[#36322D]' : 'col-span-2 box-div border border-solid border-[#EBEBEB]']">
          <div class="text-[24px] font-bold mb-[30px]" :class="{'text-center' : pageType !== 'create'}">Launch Node</div>
          <a-form :model="formData" ref="formRef" :rules="formRules" layout="vertical" :class="{'w-[75%]' : pageType === 'create'}">
            <a-form-item label="Protocol" name="protocol" >
              <a-select @change="getNodeResource" v-model:value="formData.protocol" autocomplete="off"
                :options="protocolOptions" ></a-select>
            </a-form-item>
            <a-form-item label="Region" name="region" >
              <a-select v-model:value="formData.region" autocomplete="off"
                :options="regionOptions" ></a-select>
            </a-form-item>
            <a-form-item label="Recommended Resource" >
              <div :class="{'box-div' : theme.themeValue !== 'dark' && pageType === 'create' }" class="border border-solid  border-[#EBEBEB] dark:border-[#434343] rounded-[12px] grid grid-cols-3">
                <div class="p-[20px] text-center">
                  <div class="text-[#151210] dark:text-[#E0DBD2] text-[16px] font-bold flex justify-center items-center">
                    <svg-icon name="cpu" size="18" class="mr-2" />CPU
                  </div>
                  <div class="text-[36px] mt-[10px]">{{ resourceInfo.cpu }}</div>
                  <div class="text-[#73706E] dark:text-[#E0DBD2]">Cores</div>
                </div>
                <div class="p-[20px] text-center">
                  <div class="text-[#151210] dark:text-[#E0DBD2] text-[16px] font-bold flex justify-center items-center">
                    <svg-icon name="memory" size="18" class="mr-2" />Memory
                  </div>
                  <div class="text-[36px] mt-[10px]">{{ resourceInfo.memory }}</div>
                  <div class="text-[#73706E] dark:text-[#E0DBD2]">GB</div>
                </div>
                <div class="p-[20px] text-center">
                  <div class="text-[#151210] dark:text-[#E0DBD2] text-[16px] font-bold flex justify-center items-center">
                    <svg-icon name="disk" size="18" class="mr-2" />Disk
                  </div>
                  <div class="text-[36px] mt-[10px]">{{ resourceInfo.disk }}</div>
                  <div class="text-[#73706E] dark:text-[#E0DBD2]">GB</div>
                </div>
              </div>
            </a-form-item>
            <a-form-item label="Node Name" name="nodeName" >
              <a-input v-model:value="formData.nodeName" autocomplete="off" placeholder="Please input node name" allowClear></a-input>
            </a-form-item>
          </a-form>
          <hr />
          <div class="flex justify-between items-center">
            <div class="text-[#151210] dark:text-[#FFFFFF] font-bold text-[16px]">Cost:<span class="text-[#E2B578] text-[24px] ml-2">${{ resourceInfo.costPerMonth }}</span><span class="mx-1">/</span>Month</div>
            <div>
              <a-button type="primary" ghost class=" w-[120px]" @click="cancel">Cancel</a-button>
              <a-button type="primary" class="ml-[20px] w-[120px]" @click="goLaunch">Launch</a-button>
            </div>
          </div>
        </div>
        <div class="rounded-[12px] p-[30px]" v-if="pageType !== 'create'" :class="[theme.themeValue === 'dark' ? 'dark:bg-[#36322D]' : 'box-div border border-solid border-[#EBEBEB]']">
          <div class="text-center mb-[40px]">
            <svg-icon :name="`${formData.protocol}-logo`" size="40" />
            <div class="text-[18px] font-bold text-[#E2B578] mt-[20px]">The benefits of {{ formData.protocol }}</div>
          </div>
          <div class="flex">
            <div class="flex items-center mr-[10px]">
              <svg-icon name="decentralized" size="24" />
            </div>
            <div class="benefit-bg">
              <div class="title text-[#151210] dark:text-[#FFFFFF]">{{ benefitsInfo.title1 }}</div>
              <div class="text-[#73706E] dark:text-[#E0DBD2]">{{ benefitsInfo.desc1 }}</div>
            </div>
          </div>
          <div class="flex mt-[30px]">
            <div class="flex items-center mr-[10px]">
              <svg-icon name="contracts" size="24" />
            </div>
            <div class="benefit-bg">
              <div class="title text-[#151210] dark:text-[#FFFFFF]">{{ benefitsInfo.title2 }}</div>
              <div class="text-[#73706E] dark:text-[#E0DBD2]">{{ benefitsInfo.desc2 }}</div>
            </div>
          </div>
          <div class="flex mt-[30px]">
            <div class="flex items-center mr-[10px]">
              <svg-icon name="developer" size="24" />
            </div>
            <div class="benefit-bg">
              <div class="title text-[#151210] dark:text-[#FFFFFF]">{{ benefitsInfo.title3 }}</div>
              <div class="text-[#73706E] dark:text-[#E0DBD2]">{{ benefitsInfo.desc3 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <a-modal v-model:visible="showPayFailedModal" :footer="null">
      <template #closeIcon>
          <img class="" src="@/assets/icons/closeIcon.svg" @click="closePayModal"/>
      </template>
      <div style="text-align:center">
        <svg-icon name="payFail" size="80" class="block mt-[20px]"/>
        <div class="text-[24px] font-bold text-[#151210] mt-[20px]">Payment Failed</div>
        <div class="text-[16px]">Payment failed, please try again.</div>
      </div>
      <div style="width:100%;display:flex;justify-content: center;margin-top: 20px;">
          <a-button @click="closePayModal">Confirm</a-button>
      </div>
  </a-modal>
  <a-modal v-model:visible="showPayProgressModal" :footer="null"  :maskClosable="false">
    <template #closeIcon></template>
    <div style="text-align:center">
      <a-spin :indicator="indicator"/>
      <div class="text-[24px] font-bold text-[#151210] mt-[20px]">Payment In Progress</div>
      <div class="text-[16px] mb-[30px]">This may take a few moment, please wait.</div>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, toRefs,h,onUnmounted, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/useTheme";
import { LoadingOutlined } from '@ant-design/icons-vue';
import { apiAddProjects, apiGetNodeResource } from "@/apis/node";
import { message } from 'ant-design-vue';
import io from "socket.io-client";

const theme = useThemeStore();
const props = defineProps({
  pageType: String,

});
const { pageType } = toRefs(props);

const showPayFailedModal = ref(false)
const showPayProgressModal = ref(false)
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '60px',
    marginTop: '30px'
  },
  spin: true,
});

const router = useRouter();

const protocolOptions = ref([
  {lable: 'Ethereum', value: 'Ethereum'},
  {lable: 'Sui', value: 'Sui'},
  {lable: 'Near', value: 'Near'},
  {lable: 'Starknet', value: 'Starknet'},
  {lable: 'Aptos', value: 'Aptos'},
  {lable: 'Optimism', value: 'Optimism'},
  {lable: 'Avalanche', value: 'Avalanche'},
]);
const regionOptions = ref([
  {lable: 'US East', value: 'US East'}
]);
const benefitsList = ref<any>({
  Ethereum: {
    title1: 'Decentralized architecture', desc1: 'Decentralized network, high security and stability.',
    title2: 'Smart contracts', desc2: 'Automatically execute business terms, simplify processes and reduce costs.',
    title3: 'Developer-friendly', desc3: 'Complete tools and resources to encourage ecosystem development.'
  },
  Sui: {
    title1: 'High performance', desc1: 'Sui uses its own consensus algorithm and blockchain structure to achieve tens of thousands of transactions per second, with extremely high performance.',
    title2: 'Zero-knowledge proof', desc2: 'While ensuring high performance, Sui achieves complete privacy protection and uses zero-knowledge proof for anonymous transfers and smart contract deployments.',
    title3: 'Easy to develop', desc3: 'Sui provides an easy-to-use programming framework and language, so that developers can easily develop DApps and smart contracts on Sui'
  },
  Near: {
    title1: 'Scalability', desc1: 'Near achieves high performance and scalability through techniques like sharding, handling an enormous number of transactions per second.',
    title2: 'Low cost', desc2: 'Running smart contracts and applications on Near is very cost-effective, benefiting both developers and users.',
    title3: 'Developer-friendly', desc3: 'Near allows developers to build blockchain applications in an easy manner with low deployment and usage costs.'
  },
  Starknet: {
    title1: 'Scalability', desc1: 'Starknet achieves high performance and scalability using zero-knowledge proofs, handling thousands of transactions per second',
    title2: 'Low cost', desc2: 'Starknet greatly reduces the cost of deploying and running smart contracts. The contracts are small in size but powerful in function',
    title3: 'Privacy', desc3: 'Starknet protects the privacy of on-chain data and computations using zero-knowledge proofs without revealing user private information'
  },
  Aptos: {
    title1: 'Scalability', desc1: 'Aptos achieves high performance and scalability using its own Move language and sharding technology, handling tens of thousands of transactions per second.',
    title2: 'Security', desc2: 'Aptos is backed by Libra\'s technical team and can provide a secure and stable blockchain mainnet service.',
    title3: 'Low cost', desc3: 'Compared with traditional public chains, Aptos greatly reduces the cost for users and developers to use the blockchain.'
  },
  Optimism: {
    title1: 'Scalability', desc1: 'As a Layer 2 scaling solution, Optimism can greatly expand Ethereum\'s transaction processing capacity to tens of thousands of transactions per second',
    title2: 'Low cost', desc2: 'By aggregating transactions, Optimism reduces the gas fees on the Ethereum mainnet to achieve low-cost on-chain transactions and applications',
    title3: 'Ethereum compatible', desc3: 'Optimism is fully compatible with the Ethereum mainnet, and can directly use Ethereum wallets, assets, tools, and dapps'
  },
  Avalanche: {
    title1: 'Scalability', desc1: 'Avalanche achieves tens of thousands of transactions per second, outperforming Ethereum and other public chains',
    title2: 'Low cost', desc2: 'By using subnets and parallel chains, Avalanche greatly reduces the cost of running dapps with gas fees far lower than Ethereum',
    title3: 'Interoperability', desc3: 'Avalanche aims to connect existing public and private chains to enable cross-chain interoperability of assets and data'
  },
});
const benefitsInfo = ref<any>(benefitsList.value[protocolOptions.value[0].value]);
const formRef = ref()
const formData = reactive({
  protocol: protocolOptions.value[0].value,
  region: regionOptions.value[0].value,
  nodeName: '',
  resourceType: '',
  nodeResource: '',
  buyTime: 1,
  amount: 0
});
const resourceInfo = ref<any>({});

const socket = io();
socket.on("connect", () => {
  console.log('service connect success');
});
socket.on("connect_error", (err:any) => {
  console.log('service connect failed ',err);
});
socket.on('order_result', (data:any)=>{
    console.log(data);
    if(data==2){
      // 支付成功
      showPayProgressModal.value = false
      router.push('/middleware/dashboard/node')
    }else if(data==3){
      // 支付失败
      showPayProgressModal.value = false
      showPayFailedModal.value = true
    }
});

const formRules = computed(() => {
    const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
    return {
        nodeName: [requiredRule('')],
    };
});
const goLaunch = async() => {
  await formRef.value.validate();
  
  try {
    formData.nodeResource = resourceInfo.value.cpu+'C'+resourceInfo.value.memory+'GB '+resourceInfo.value.disk+'GB'; 
    formData.resourceType = formData.protocol + ' | ' + formData.region  + ' | ' + formData.nodeResource;
    formData.amount = resourceInfo.value.costPerMonth;
    const res = await apiAddProjects(formData)
    if (res.code === 200) {
      showPayProgressModal.value = true
      window.open('/middleware/pay?id='+res.data)
      socket.emit('order_status_model',res.data)
    }
  } catch(err:any) {
    message.error(err.response.data.message);
  }
}
const getNodeResource = async () => {
  try {
    const { data } = await apiGetNodeResource(formData.protocol);
    resourceInfo.value = data;
    if (pageType?.value !== 'create') {
      benefitsInfo.value = benefitsList.value[formData.protocol];
    }
  } catch(err:any) {
    message.error(err.response.data.message);
  }
}
const cancel = () => {
  router.go(-1)
}
const closePayModal = ()=>{
  showPayFailedModal.value = false
}
onMounted(() => {
  getNodeResource();
})
onUnmounted(()=>{
  socket.close()
})
</script>
<style lang="less" scoped>
html[data-theme='dark'] {
  hr{
    border-color: #434343;
  }
}
hr{
  border: 1px solid #EBEBEB;
  margin-top: 40px;
  margin-bottom: 30px;
}
.benefit-bg{
  border-radius: 8px;
  background: rgba(226,181,120,0.1);
  padding: 10px;
  .title{
    font-family: NotoSans-Regular, NotoSans;
    font-weight: 400;
  }
}
.svg-icon{
  color: #E2B578;
}
.box-div{
  box-shadow: 0px 0px 10px 0px rgba(191,191,191,0.2);
}
</style>