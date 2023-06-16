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
              <div class="text-[#151210] dark:text-[#FFFFFF]">Decentralized architecture</div>
              <div class="text-[#73706E] dark:text-[#E0DBD2]">Decentralized network, high security and stability.</div>
            </div>
          </div>
          <div class="flex mt-[30px]">
            <div class="flex items-center mr-[10px]">
              <svg-icon name="contracts" size="24" />
            </div>
            <div class="benefit-bg">
              <div class="text-[#151210] dark:text-[#FFFFFF]">Smart contracts</div>
              <div class="text-[#73706E] dark:text-[#E0DBD2]">Automatically execute business terms, simplify processes and reduce costs.</div>
            </div>
          </div>
          <div class="flex mt-[30px]">
            <div class="flex items-center mr-[10px]">
              <svg-icon name="developer" size="24" />
            </div>
            <div class="benefit-bg">
              <div class="text-[#151210] dark:text-[#FFFFFF]">Developer-friendly</div>
              <div class="text-[#73706E] dark:text-[#E0DBD2]">Complete tools and resources to encourage ecosystem development.</div>
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
import { apiOrderDetail } from '@/apis/chainlink'
import { io } from "socket.io-client";

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

const orderId = ref()
const socket = io("");
socket.on('message', (data)=>{
    console.log(data);
    // if(){
    // 支付成功
    // router.push('/middleware/dashboard/node')
    // }else if(){
    // 支付失败
    // showPayProgressModal.value = false
    // showPayFailedModal.value = true
    // }
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
      const result = await apiOrderDetail(res.data)
      orderId.value = result.data.orderId
      socket.emit('orderId',orderId)
    }
  } catch(err:any) {
    message.error(err.response.data.message);
  }
}
const getNodeResource = async () => {
  try {
    const { data } = await apiGetNodeResource(formData.protocol);
    resourceInfo.value = data;
  } catch(err:any) {
    message.error(err.response.data.message);
  }
}
const cancel = () => {
  router.go(-1)
}
const closePayModal = ()=>{
  showPayProgressModal.value = false
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
}
.svg-icon{
  color: #E2B578;
}
.box-div{
  box-shadow: 0px 0px 10px 0px rgba(191,191,191,0.2);
}
</style>