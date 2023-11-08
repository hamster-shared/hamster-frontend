<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <div class="text-[24px] font-bold">Import Git Repository</div>
    <div class="text-[14px] text-[#E2B578] mb-[20px]">Import Third-Party Git Repository ></div>
    <div class="card">
      <img class="h-[108px] w-[108px]" src="@/assets/images/ImportInstall.png" />
      <div class="my-[20px]">Install the Github application for the accounts you wish to import from to continue</div>
      <a-button type="primary" class="w-[150px]" @clcik="installGit">Install</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore()

const installGit = () => { }

</script>
<style scoped lang="less">
.card {
  background: #35322E;
  border-radius: 12px;
  border: 1px solid #434343;
  padding: 120px;
  text-align: center;
}

.white-css {
  .card {
    background: #FFFFFF;
    box-shadow: 0px 0px 10px 0px rgba(191, 191, 191, 0.2);
    border-radius: 12px;
    border: 1px solid #EBEBEB;
  }
}
</style>