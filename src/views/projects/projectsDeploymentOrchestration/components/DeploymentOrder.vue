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
    <div class="item" v-for="item in dataList" :key="item" draggable="true" @dragstart="dragstart(item)"
      @dragenter="dragenter(item)" @dragend="dragend(item)">{{ item }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const dataList = ref<string[]>(['第1111111111条数据', '第2222222222条数据', '第33333333333条数据', '第44444444444条数据', '第55555555555条数据']);
const clickVal = ref<string>();//点击的元素，即最开始要移动的元素（改变位置）
const moveVal = ref<string>();//移动的元素
const endVal = ref<string>();//落点的元素
const dragstart = (item: string): void => {
  clickVal.value = item; //记录刚开始移动元素的值
}
const dragenter = (item: string): void => {
  moveVal.value = item; //记录元素移入的终点位置
}
const dragend = (item: string): void => {
  endVal.value = item;
  let index = dataList.value.indexOf(item)     //移动元素的当前位置
  let moveObj = moveVal.value ? moveVal.value : ''
  let addIndex = dataList.value.indexOf(moveObj)     //要移动后的位置
  dataList.value.splice(index, 1);//先删掉移动的那个元素，返回改变数组
  dataList.value.splice(addIndex, 0, item);//把删掉的元素再插入到对应的位置
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
    color: #fff;
    background: #35322E;
    border-radius: 12px;
    border: 1px solid #434343;
  }
}
</style>