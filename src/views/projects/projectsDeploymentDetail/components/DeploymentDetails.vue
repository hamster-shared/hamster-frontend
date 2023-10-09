<template>
  <div class="dark:bg-[#1D1C1A] bg-[#FFFFFF] mt-[25px] rounded-[12px] p-[32px]">
    <div class="flex justify-between items-center">
      <div class="font-bold text-[24px]">Deployment Details</div>
      <div>
        <a-button type="primary" ghost>Stop</a-button>
        <a-button type="primary" class="mx-[24px]">View Dashboard</a-button>
        <a-select ref="select" v-model:value="actionVal" class="w-[140px]"
          :options="actionOptions">
        </a-select>
      </div>
    </div>
    <div class="my-[24px] py-[16px] px-[32px] border border-solid border-[#E2B578] rounded-[12px] bg-[rgba(226,181,120,0.1)]">
      <svg-icon name="tips" size="26" class="svg-color mr-2" />
      The following contracts will be deployed on the Ethereum/Goerli
    </div>
    <a-collapse v-model:activeKey="activeKey">
        <a-collapse-panel v-for="item in deploymentList" :key="item.id" :header="item.name" @click="">
          <template #extra>
            <div class="flex items-center">
              <div v-if="item.status === 'failed'" class="text-[#E2B578] font-semibold mr-[20px]">Redeploy</div>
              <svg-icon :name="item.status" size="22" class="mr-2" />
              <div class="w-[60px]">{{ item.status }}</div>
            </div>
          </template>
          <div class="bg-[#191816]">
            <div v-if="item.content" class="p-[20px] flex justify-between">
              <div>
                <div class="flex items-center">
                  <div class="collapse-content-title">Transaction Hash:</div>
                  <div>0xce5d907630930b336f1ce6eacbbcc6816906b65d980fa28e6b3f3d8a0c626321
                    <svg-icon name="copy" size="18" class="svg-color ml-2" />
                  </div>
                </div>
                <div class="flex items-center mt-[10px]">
                  <div class="collapse-content-title">Block:</div>
                  <div>9577367</div>
                </div>
              </div>
              <div class="text-[#E2B578] text-[14px] font-semibold cursor-pointer">View on block explorer</div>
            </div>
            <div v-else class="text-[#666666] text-[18px] font-medium py-[70px] text-center">NO Data</div>
          </div>
        </a-collapse-panel>
      </a-collapse>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const activeKey = ref(['1']);
const actionVal = ref('All Action')
const actionOptions = ref([
  {lable: 'View Dashboard', value: 'Dashboard'},
  {lable: 'View Setting', value: 'Setting'},
]);
const deploymentList = ref<any>([
  {name: 'Contract A',id:'1',status:'success',content: '123'},
  {name: 'Contract B',id:'2',status:'failed',content: '123'},
  {name: 'Contract C',id:'3',status:'wait'},
]);
</script>
<style scoped lang="less">

:deep(.ant-btn-primary) {
  width: 140px;
  height: 40px;
}
.svg-color{
  color: #E2B578;
}
:deep(.ant-collapse){
  background-color: #36322D;
  border-color: #36322D; 
  border-radius: 12px;
}
:deep(.ant-collapse > .ant-collapse-item){
  border-color: #454545;
}
:deep(.ant-collapse>.ant-collapse-item>.ant-collapse-header){
  padding: 20px 20px;
}
:deep(.ant-collapse>.ant-collapse-item>.ant-collapse-header .ant-collapse-arrow){
  font-size: 16px;
  color: #E2B578;
}
:deep(.ant-collapse-content){
  border-top: none;
}
:deep(.ant-collapse-content>.ant-collapse-content-box){
  background-color: #36322D; 
  padding: 0 20px 20px 20px;
}
</style>
<style scoped>
.collapse-content-title{
  @apply text-[14px] text-[#BBBAB9] font-medium mr-[20px] w-[170px] text-right;
}
</style>