<template>
  <div :class="theme.themeValue === 'dark' ? 'dark-css' : 'white-css'">
    <div class="card mt-[20px]">
      <img class="h-[108px] w-[108px]" src="@/assets/images/ImportInstall.png" />
      <div class="my-[20px]">Install the Github application for the accounts you wish to import from to continue</div>
      <a-button type="primary" class="w-[150px]" @click="installGit">Install</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore()


const installGit = () => {
  const state = new Date().getTime();
  const oauthUrl = ref(import.meta.env.VITE_OAUTH_URL);
  const url = `${oauthUrl.value}?state=${state}`;
  const myWindow = window.open(url, 'select_target', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
}

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