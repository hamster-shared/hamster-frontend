<template>
  <div>
    <div class="checkbox-item" :class="checkedList.includes(it) ? 'checked' : ''" v-for="(it) in 3" :key="it"
      @click="checkedbox(it)">
      <span
        class="check-box w-[20px] h-[20px] border border-solid dark:border-[#434343] border-[#EBEBEB] mr-[8px]"></span>
      <span class="check-text dark:text-[#E0DBD2] text-[#05111A]">Name</span>
    </div>
  </div>

</template>
<script lang='ts' setup>
import { reactive } from 'vue';

const checkedList = reactive([])

const checkedbox = (val: number) => {
  if (checkedList.includes(val)) {
    const index = checkedList.findIndex(item => { return item === val })
    checkedList.splice(index, 1)
  } else {
    checkedList.push(val)
  }
}

</script>
<style lang='less' scoped>
.checkbox-item {
  display: inline-block;
  margin-right: 32px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    .check-box {
      border-color: #E2B578;
    }
  }

  .check-box {
    display: inline-block;
    border-radius: 4px;
    vertical-align: middle;
    position: relative;
  }
}

.checked {

  .check-box {
    border-color: #E2B578;

    &:after {
      content: "";
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      background-color: #E2B578;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .check-text {
    color: #E2B578;
  }
}
</style>