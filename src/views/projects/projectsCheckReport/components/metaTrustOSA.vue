<template>
  <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]">
    <span class="text-[24px] leading-[32px] font-bold">Issues Module</span>
    <div v-if="reportFileData.length === 0" class="box-card text-center py-[50px]">
      <img src="@/assets/images/report-b.png" class="w-[58px] hidden dark:inline-block" />
      <img src="@/assets/images/report-w.png" class="w-[58px] dark:hidden" />
      <div class="dark:text-white text-[#151210] text-[11px] font-bold">Congratulations！</div>
      <div class="text-[#73706E] text-[7px]">No issues were detected.</div>
    </div>
    <div v-else>
      <div class="mt-4">
        <label>Severity: </label>
        <a-button class="severity-btn" :class="[checkExitBtn(1) ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent(1)">Critical: 2</a-button>
        <a-button class="severity-btn" :class="[checkExitBtn(2) ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent(2)">High: 4</a-button>
        <a-button class="severity-btn" :class="[checkExitBtn(3) ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent(3)">Medium: 3 </a-button>
        <a-button class="severity-btn" :class="[checkExitBtn(4) ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent(4)">Low: 3</a-button>
        <a-button class="severity-btn" :class="[checkExitBtn(5) ? 'severity-btn-checked':'severity-btn-hover']" @click="showContent(5)">info: 0</a-button>
      </div>
      <div v-if="checkedBtn.length === 0" class="box-card text-[#BBBAB9] text-center py-[80px]">
        <div class="text-[10px]">No Data…</div>
        <div class="text-[8px]">You currently do not choose to display data</div>
      </div>
      <div v-else class="box-card p-[32px]" v-for="val in reportFileData" :key="val.name">
        <div class="flex justify-between">
          <div class="title">Flat</div>
          <div class="right-text">Critical</div>
        </div>
        <div class="sub-title">CVE-2020-36632  | BSD 3-Clause "New" or "Revised" License</div>
        <div class="sub-title mt-[20px]">Description</div>
        <div class="desc">A vulnerability, which was classified as critical, was found in hughsk flat up to 5.0.0. This affects the function unflatten of the file index.js. The manipulation leads to improperly controlled modification of object prototype attributes ('prototype pollution'). It is possible to initiate the attack remotely. Upgrading to version 5.0.1 is able to address this issue. The name of the patch is 20ef0ef55dfa028caddaedbcb33efbdb04d18e13. It is recommended to upgrade the affected component. The identifier VDB-216777 was assigned to this vulnerability.</div>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';

const reportFileData = ref([
  {name:'Flat'}
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
.box-card{
  margin-top: 25px;
  background: #FFFFFF;
  box-shadow: 3px 3px 12px 0px rgba(203,217,207,0.2);
  border-radius: 12px;
  border: 1px solid #F8F8F8;
  line-height: 22px;
  font-size: 16px;
  .title{
    font-weight: bold;
    margin-bottom: 10px;
  }
  .right-text{
    font-weight: 400;
    color: #FF0003;
  }
  .sub-title{
    font-weight: 400;
    color: #000000;
  }
  .desc{
    font-weight: 400;
    color: #73706E;
    margin-top: 10px;
  }
}
</style>