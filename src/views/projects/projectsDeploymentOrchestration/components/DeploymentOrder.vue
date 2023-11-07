<template>
  <div>
    <div class="text-[24px] font-bold">Deployment Order</div>
    <div class="text-[#73706E] dark:text-[#E0DBD2] text-[16px] mb-[20px]">The deployment order can be freely set by dragging the
      concant
      cards up
      and down. The
      just confirm to quickly
      start the deploymnet, which is convenient and fast.</div>
  </div>

  <div class="main" :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <div class="flex justify-between item" :class="selectId == (item.id+'$'+item.name) ? 'selected' : ''"
      v-for="(item, index) in dataList" :key="item.name" draggable="true" @click="selectContractId(item)"
      @dragstart="dragstart(item)" @dragenter="dragenter(item)" @dragend="dragend(item)">
      <div class="font-bold">
        <span class=" bg-[#E2B578] text-[#FFFFFF] px-[8px] py-[2px] rounded-[2px] mr-[20px]">{{ index + 1
        }}</span>
        <span>{{ item.name }}</span>
      </div>
      <div>
        <a-popover trigger="hover" placement="left">
          <template #content>
            <div class=" cursor-pointer mb-[8px] hover:text-[#E2B578]" @click="deployBtn(item)">Do Not Deploy</div>
            <div class="cursor-pointer hover:text-[#E2B578]" @click="duplicateBtn(item)">Duplicate</div>
          </template>
          <img class="w-[5px] cursor-pointer" src="@/assets/images/diandian.png" />
        </a-popover>
      </div>
    </div>
  </div>
  <div class="h-[1px] my-[32px] border border-solid dark:border-[#434343] border-[#EBEBEB]"></div>

  <div class="text-[24px] font-bold mb-[20px]">
    Skipped Contract Deployment
  </div>
  <div class="main mb-[10px]">
    <div class="flex justify-between item" v-for="(item, index) in duplicateDataList" :key="item.name"
      @click="selectContractId(item)">
      <div class="font-bold">
        <span class="bg-[#E2B578] text-[#FFFFFF] px-[12px] py-[2px] rounded-[2px] mr-[20px] opacity-30"></span>
        <span>{{ item.name }}</span>
      </div>
      <div>
        <a-popover trigger="hover" placement="left">
          <template #content>
            <div class=" cursor-pointer mb-[8px] hover:text-[#E2B578]" @click="cancelSkipBtn(item)">Cancel
              Skip</div>
          </template>
          <img class="w-[5px] cursor-pointer" src="@/assets/images/diandian.png" />
        </a-popover>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from "@/stores/useTheme";
import { v4 as uuidv4 } from 'uuid';
import { apiSaveLeftInfo } from '@/apis/contractOrchestrationDeploy'

const theme = useThemeStore();
const route = useRoute()
const id:any = route.query.id
  
const dataList = ref<any>([]);
const clickVal = ref<string>();//点击的元素，即最开始要移动的元素（改变位置）
const moveVal = ref<string>();//移动的元素
const endVal = ref<string>();//落点的元素

const selectId = ref();
const duplicateDataList = ref<any>([]);

const emit = defineEmits(['selectContractId','getProjectsContractName'])

const props = defineProps({
  contractOrchestration:{
    type:Array,
    default:()=>[]
  },
  version:{
    type:String,
    default:''
  },
  noUseContract:{
    type:Array,
    default:()=>[]
  }
})

const { contractOrchestration, version, noUseContract } = toRefs(props)
nextTick(()=>{
  dataList.value = contractOrchestration.value
  duplicateDataList.value = noUseContract.value
})


const dragstart = (item: any): void => {
  clickVal.value = item; //记录刚开始移动元素的值

}
const dragenter = (item: any): void => {
  moveVal.value = item; //记录元素移入的终点位置
}
const dragend = (item: any): void => {
  endVal.value = item;
  let index = dataList.value.indexOf(item)     //移动元素的当前位置
  let moveObj = moveVal.value ? moveVal.value : {}
  let addIndex = dataList.value.indexOf(moveObj)     //要移动后的位置
  dataList.value.splice(index, 1);//先删掉移动的那个元素，返回改变数组
  dataList.value.splice(addIndex, 0, item);//把删掉的元素再插入到对应的位置
  getUseAndNotContractArr()
}


const selectContractId = (item: any) => {
  // selectId.value = item.id+'$'+item.name;
  console.log(item, '选中')
  emit('selectContractId', item.id+'$'+item.name, item.abiInfo)
}


// 不执行
const deployBtn = (item: any) => {
  let index = dataList.value.indexOf(item)
  dataList.value.splice(index, 1);
  duplicateDataList.value.push(item);
  getUseAndNotContractArr()
}

// copy 一份
const duplicateBtn = (item: any) => {
  const en:any = {}
  Object.assign(en,item)
  const flag = uuidv4();
  en.name = en.name+` copy #${flag.slice(0,8)}`
  dataList.value.push(en)
  getUseAndNotContractArr()
}

// 保存页面的顺序到后端
const getUseAndNotContractArr = async()=>{
  const useContract = dataList?.value?.map((item:any)=>{
    return item.name
  }) || []
  const noUseContract = duplicateDataList?.value?.map((item:any)=>{
    return item.name
  }) || []
  const params = {
    projectId: id,
    version: version.value,
    useContract,
    noUseContract
  }
  await apiSaveLeftInfo(id, params)
}


const cancelSkipBtn = async(item: any) => {
  let index = duplicateDataList.value.indexOf(item)
  duplicateDataList.value.splice(index, 1);

  console.log(duplicateDataList, '00')
  dataList.value.push(item)
  await getUseAndNotContractArr()
  emit('getProjectsContractName')
}

onMounted(()=>{
  
})

defineExpose({
  selectId,
})
</script>
<style scoped lang="less">
.main {
  margin-top: 20px;
  display: flex;
  flex-direction: column;

  .item {
    cursor: pointer;
    margin-bottom: 10px;
    width: 100%;
    text-align: center;
    height: 62px;
    line-height: 62px;
    // color: #fff;
    background: #35322E;
    border-radius: 12px;
    // border: 1px solid #434343;
    padding-left: 20px;
    padding-right: 20px;
  }

  .item.selected, .item:hover {
    border: 1px solid #E2B578;
  }
}
.white-css{
  .item{
    background-color: #F6F6F6;
    border-color: #EBEBEB;
  }
}

// .ant-popover-placement-left .ant-popover-arrow {
//   left: 100% !important;
// }
</style>