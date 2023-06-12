<template>
  <div>
    <div class="my-10">
      <div class=" grid grid-cols-3">
        <div class="col-span-2 bg-[#36322D] rounded-[12px] mr-[30px] p-[30px] text-[#FFFFFF]">
          <div class="text-[24px] font-bold text-center mb-[30px]">Launch Node</div>
          <a-form :model="formData" ref="formRef" :rules="formRules" layout="vertical">
            <a-form-item label="Protocol" name="protocol" >
              <a-select @change="setOtherInfo" v-model:value="formData.protocol" autocomplete="off"
                :options="protocolOptions" ></a-select>
            </a-form-item>
            <a-form-item label="Region" name="region" >
              <a-select v-model:value="formData.region" autocomplete="off"
                :options="regionOptions" ></a-select>
            </a-form-item>
            <a-form-item label="Recommended Resource" >
              <div class="border border-solid border-[#434343] rounded-[12px] grid grid-cols-3">
                <div class="p-[20px] text-center">
                  <div class="text-[#E0DBD2] text-[16px] font-bold flex justify-center items-center">
                    <svg-icon name="cpu" size="18" class="mr-2" />CPU
                  </div>
                  <div class="text-[36px] mt-[10px]">{{ resourceInfo.cpu }}</div>
                  <div class="text-[#E0DBD2]">Cores</div>
                </div>
                <div class="p-[20px] text-center">
                  <div class="text-[#E0DBD2] text-[16px] font-bold flex justify-center items-center">
                    <svg-icon name="memory" size="18" class="mr-2" />Memory
                  </div>
                  <div class="text-[36px] mt-[10px]">{{ resourceInfo.memory }}</div>
                  <div class="text-[#E0DBD2]">GB</div>
                </div>
                <div class="p-[20px] text-center">
                  <div class="text-[#E0DBD2] text-[16px] font-bold flex justify-center items-center">
                    <svg-icon name="disk" size="18" class="mr-2" />Disk
                  </div>
                  <div class="text-[36px] mt-[10px]">{{ resourceInfo.disk }}</div>
                  <div class="text-[#E0DBD2]">GB</div>
                </div>
              </div>
            </a-form-item>
            <a-form-item label="Node Name" name="nodeName" >
              <a-input v-model:value="formData.nodeName" autocomplete="off" placeholder="Please input node name"
                :options="regionOptions" allowClear></a-input>
            </a-form-item>
            <hr />
            <div class="flex justify-between items-center">
              <div class="text-[#FFFFFF] font-bold text-[16px]">Cost:<span class="text-[#E2B578] text-[24px] ml-2">${{ resourceInfo.cost }}</span><span class="mx-1">/</span>Month</div>
              <div>
                <a-button type="primary" ghost class=" w-[120px]" @click="cancel">Cancel</a-button>
                <a-button type="primary" class="ml-[20px] w-[120px]" @click="goLaunch">Launch</a-button>
              </div>
            </div>
          </a-form>
        </div>
        <div class="bg-[#36322D] rounded-[12px] p-[30px]">
          <div class="text-center mb-[40px]">
            <svg-icon name="ethereum-title" size="40" />
            <div class="text-[18px] font-bold text-[#E2B578] mt-[20px]">The benefits of Ethereum</div>
          </div>
          <div class="flex">
            <div class="flex items-center mr-[10px]">
              <svg-icon name="decentralized" size="24" />
            </div>
            <div class="benefit-bg">
              <div class="text-[#FFFFFF]">Decentralized architecture</div>
              <div class="text-[#E0DBD2]">Decentralized network, high security and stability.</div>
            </div>
          </div>
          <div class="flex mt-[30px]">
            <div class="flex items-center mr-[10px]">
              <svg-icon name="contracts" size="24" />
            </div>
            <div class="benefit-bg">
              <div class="text-[#FFFFFF]">Smart contracts</div>
              <div class="text-[#E0DBD2]">Automatically execute business terms, simplify processes and reduce costs.</div>
            </div>
          </div>
          <div class="flex mt-[30px]">
            <div class="flex items-center mr-[10px]">
              <svg-icon name="developer" size="24" />
            </div>
            <div class="benefit-bg">
              <div class="text-[#FFFFFF]">Developer-friendly</div>
              <div class="text-[#E0DBD2]">Complete tools and resources to encourage ecosystem development.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();
const formRef = ref()
const formData = reactive({
    protocol: 'Ethereum',
    region: 'US East',
    nodeName: '',
});

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
const resourceList = ref<any>({
  Ethereum: {cpu: '4', memory: '32', disk: '3000', cost: '530'},
  Sui: {cpu: '8', memory: '32', disk: '300', cost: '657.2'},
  Near: {cpu: '4', memory: '8', disk: '1300', cost: '318'},
  Starknet: {cpu: '2', memory: '4', disk: '500', cost: '95.4'},
  Aptos: {cpu: '8', memory: '32', disk: '2000', cost: '551.2'},
  Optimism: {cpu: '4', memory: '16', disk: '200', cost: '164.3'},
  Avalanche: {cpu: '8', memory: '16', disk: '1000', cost: '413.4'},
});
const resourceInfo = ref(resourceList.value.Ethereum);

const formRules = computed(() => {
    const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
    return {
        nodeName: [requiredRule('')],
    };
});
const setOtherInfo = (val: string) => {
  console.log("val:",val);
  resourceInfo.value = resourceList.value[val];
}
const goLaunch = () => {
  formRef.value.validate();
  console.log("go...");
}
const cancel = () => {
  router.go(-1)
}
</script>
<style lang="less" scoped>
hr{
  border: 1px solid #434343;
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
</style>