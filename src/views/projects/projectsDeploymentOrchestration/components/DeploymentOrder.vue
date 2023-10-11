<template>
  <div>
    <div class="text-[24px] font-bold">Deployment Order</div>
    <div class="text-[#E0DBD2] text-[16px] mb-[20px]">The deployment order can be freely set by dragging the
      concant
      cards up
      and down. The
      just confirm to quickly
      start the deploymnet, whic is convenient and fast.</div>
  </div>

  <div class="main">
    <div
      class="flex justify-between item bg-[#FCFCFC] dark:bg-[#35322E] border-[#D2D2D2] border border-solid dark:border-[#434343] text-[#000000] dark:text-[#fff]"
      :class="selectId == item.id ? 'selected' : ''" v-for="(item, index) in dataList" :key="item.id" draggable="true"
      @click="selectContractId(item)" @dragstart="dragstart(item)" @dragenter="dragenter(item)" @dragend="dragend(item)">
      <div>
        <span class="font-bold bg-[#E2B578] color-[#FFFFFF] px-[8px] py-[2px] rounded-[2px] mr-[20px]">{{ index + 1
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
    <div class="flex justify-between item" v-for="(item, index) in duplicateDataList" :key="item.id"
      @click="selectContractId(item)">
      <div>
        <span class="font-bold bg-[#E2B578] color-[#FFFFFF] px-[12px] py-[2px] rounded-[2px] mr-[20px] opacity-30"></span>
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
import { ref } from 'vue';

const dataList = ref([{ name: 'Contract A', id: '1' }, { name: 'Contract B', id: '2' }, { name: 'Contract C', id: '3' }, { name: 'Contract D', id: '4' }, { name: 'Contract E', id: '5' }]);
const clickVal = ref<string>();//点击的元素，即最开始要移动的元素（改变位置）
const moveVal = ref<string>();//移动的元素
const endVal = ref<string>();//落点的元素


const selectId = ref();
const duplicateDataList = ref([]);

const emit = defineEmits(['selectContractId'])


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
}


const selectContractId = (item: any) => {
  selectId.value = item.id;
  console.log(item, '选中')
  emit('selectContractId', selectId.value)
}


// 不执行
const deployBtn = (item: any) => {
  let index = dataList.value.indexOf(item)
  dataList.value.splice(index, 1);
  duplicateDataList.value.push(item);
}

// copy 一份
const duplicateBtn = (item: any) => {
  let index = dataList.value.indexOf(item)
  dataList.value.push(item)
}


const cancelSkipBtn = (item: any) => {
  let index = duplicateDataList.value.indexOf(item)
  duplicateDataList.value.splice(index, 1);

  console.log(duplicateDataList, '00')
  dataList.value.push(item)
}


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
    // background: #35322E;
    border-radius: 12px;
    // border: 1px solid #434343;
    padding-left: 20px;
    padding-right: 20px;
  }

  .item.selected {
    border: 1px solid #E2B578;
  }
}

// .ant-popover-placement-left .ant-popover-arrow {
//   left: 100% !important;
// }
</style>