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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore();
const router = useRouter();
const apiUrl = ref(import.meta.env.VITE_HAMSTER_URL)
const clientId = ref(import.meta.env.VITE_APP_CLIENTID);
const oauthUrl = ref('https://github.com/login/oauth/authorize');
const selectTargetUrl = ref(import.meta.env.VITE_OAUTH_URL);
const loginType = ref(1);

// const emit = defineEmits(['resetData']);

// const resetData = () => {
//   console.log('install成功， 刷新数据')
//   emit('resetData')
// }

const installGit = () => {
  // loginType.value === 1 githun登录 2 === metaMask登录
  if (loginType.value == 1) {
    const state = new Date().getTime();
    const url = `${selectTargetUrl.value}?state=${state}`;
    const myWindow = window.open(url, 'select_target', `modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700`)
    myWindow?.focus()
  } else {
    // console.log(apiUrl.value + '/projects/metaMaskAuth')
    const state = new Date().getTime();
    const url = `${oauthUrl.value}?client_id=${clientId.value}&scope=read:user&state=${state}&redirect_uri=${apiUrl.value}/projects/metaMaskAuth`;
    const myWindow = window.open(url, 'login-github', `modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700`)
    myWindow?.focus()
  }
}

onMounted(() => {
  let token = localStorage.getItem('token') || '';
  if (token) {
    let loginData = JSON.parse(decodeURIComponent(escape(window.atob(token.split('.')[1]))));
    console.log(loginData, 'token')
    loginType.value = loginData.loginType;
  }
})

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