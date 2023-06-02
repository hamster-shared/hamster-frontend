<template>
  <div style="text-align: center">
    <img src="@/assets/icons/noData--dark.svg" alt="" class="w-[128px]  noData-dark" />
    <img src="@/assets/icons/noData-white.svg" class="w-[128px]  noData-whit" />
    <p>No Data</p>
  </div>
</template>
<style lang="less" scoped>
html[data-theme='dark'] {
  .noData-dark{
    display: inline-block;
  }
  .noData-whit{
    display: none;
  }
}
.noData-dark{
  display: none;
}
.noData-whit{
  display: inline-block;
} 
</style>