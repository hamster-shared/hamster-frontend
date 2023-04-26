<template>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]">
    <span class="text-[24px] leading-[32px] font-bold">Issues Files</span>
    <div class="mt-4" v-if="reportFileData.length > 0">
      <label>Severity: </label>
      <a-button class="severity-btn" :class="[checkExitBtn(1) ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent(1)">Critical: 2</a-button>
      <a-button class="severity-btn" :class="[checkExitBtn(2) ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent(2)">High: 4</a-button>
      <a-button class="severity-btn" :class="[checkExitBtn(3) ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent(3)">Medium: 3 </a-button>
      <a-button class="severity-btn" :class="[checkExitBtn(4) ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent(4)">Low: 3</a-button>
      <a-button class="severity-btn" :class="[checkExitBtn(5) ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent(5)">info: 0</a-button>
    </div>
    <div class="box-card ">
      <div v-if="reportFileData.length === 0" class="text-center py-[50px]">
        <img src="@/assets/images/report-b.png" class="w-[58px] hidden dark:inline-block" />
        <img src="@/assets/images/report-w.png" class="w-[58px] dark:hidden" />
        <div class="dark:text-white text-[#151210] text-[11px] font-bold">Congratulations！</div>
        <div class="text-[#73706E] text-[7px]">No issues were detected.</div>
      </div>
      <div v-else-if="checkedBtn.length === 0" class="text-[#BBBAB9] text-center py-[80px]">
        <div class="text-[10px]">No Data…</div>
        <div class="text-[8px]">You currently do not choose to display data</div>
      </div>
      <a-collapse v-else v-model:activeKey="activeKey" v-for="val in reportFileData" :key="val.name">
        <a-collapse-panel v-if="val.issue > 0" :key="val.name + val.id" :header="val.name" :showArrow="false">
          <div v-if="!val.content" class="text-center">
            <img src="@/assets/images/report-b.png" class="w-[128px] hidden dark:inline-block" />
            <img src="@/assets/images/report-w.png" class="w-[128px] dark:hidden" />
            <div class="dark:text-white text-[#151210] text-[24px] font-bold">Congratulations！</div>
            <div class="text-[#73706E]">No issues were detected.</div>
          </div>
          <div>
            <div class="font-bold">
              <label class="text-[#FAAD14]">[Medium] </label>
              <label>File(s) Affected</label>
            </div>
            <div class="bg-color mt-[20px] p-[20px] h-[200px]">
              <div class="text-[#E2B578] text-[14px] flex justify-end items-center">
              <svg-icon name="external-link" size="18" class="mr-2" />Open with ChainIDE</div>
            </div>
            <div class="font-medium mt-[20px]">Description</div>
            <div class="text-[#73706E]">Reading and writing state variables multiple times will consume more gas.</div>
          </div>
          <template #extra>
            <div>
              <span class="mr-[8px] text-[14px] text-[#E2B578] font-normal">
                {{ val.issue + ' issues found' }}
              </span>
              <svg-icon name="up-arrow" size="12" />
              <!-- <img class="up-tran w-[12px] hidden dark:inline-block" src="@/assets/icons/up-b.svg" />
              <img class="up-tran w-[12px] dark:hidden" src="@/assets/icons/up.svg" /> -->
            </div>
          </template>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';

const activeKey = ref(['1']);
const reportFileData = ref([
  {id:1, name:'contracts/ERC4907.sol', issue: 1,content:'test'},
  {id:2, name:'contracts/ERC4907.sol', issue: 1,content:'test'},
  {id:3, name:'contracts/ERC4907.sol', issue: 1,content:'test'},
  {id:4, name:'contracts/ERC4907.sol', issue: 1,content:'test'},
]);
const checkedBtn: any = ref([1,2,3,4,5]);
const showContent = (value: any) => {
  let index = checkedBtn.value.findIndex((item: any) => item === value);
  if (index === -1) {
    checkedBtn.value.push(value);
  } else {
    checkedBtn.value.splice(index, 1)
  }

  console.log("showContent");
}
const checkExitBtn = (value: any) => {
  if (checkedBtn.value.findIndex((item: any) => item === value ) !==-1 ) {
    return true;
  } else {
    return false;
  }
}
</script>
<style lang='less' scoped>
.severity-btn{
  margin-left: 16px;
  width: 100px;
  background: rgba(255,255,255,0.2);
  border: 2px solid #E2B578;
  color: #E2B578;
}
.severity-btn-hover:hover{
  background: rgba(226,181,120,0.2);
  color: #E2B578;
}
.severity-btn-checked{
  background: #E2B578;
  color: #FFFFFF;
}
.svg-icon {
  transform: rotate(180deg);
  transition: all .3s, visibility 0s;
  color: #E2B578;
}
:deep(.ant-collapse-item-active .svg-icon) {
  transform: rotate(0deg);
}
:deep(.ant-collapse){
  border-bottom: 1px solid #F3F3F3;
  font-size: 16px;
}
:deep(.ant-collapse-item){
  padding: 0 24px;
}
:deep(.ant-collapse-header){
  font-weight: 500;
  padding: 15px 0 !important;
}
:deep(.ant-collapse-content-box){
  border-radius: 12px;
  border: 1px solid rgba(151, 151, 151, 0.2);
  margin-bottom: 20px;
}
.box-card{
  margin-top: 25px;
  background: #FFFFFF;
  box-shadow: 3px 3px 12px 0px rgba(203,217,207,0.2);
  border-radius: 12px;
  border: 1px solid #F8F8F8;
  line-height: 22px;
  font-size: 16px;
  .bg-color{
    background-color: rgba(216, 216, 216, 0.2);
  }
  
}
</style>