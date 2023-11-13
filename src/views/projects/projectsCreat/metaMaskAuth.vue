<template>
  <div class="text-center metaMaskAuth">
    <div class="text-[20px] font-bold mb-[20px]">Please wait...</div>
    <a-spin />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { githubInstallAuth } from "@/apis/login";
const router = useRouter();
const setupAction = ref('');
const loginType = ref();
const apiUrl = ref(import.meta.env.VITE_BASE_API)
const clientId = ref(import.meta.env.VITE_APP_CLIENTID);
const selectTargetUrl = ref(import.meta.env.VITE_OAUTH_URL);


const initGithubInstallAuth = async () => {
  if (router.currentRoute.value.query?.code) {
    const params = {
      code: router.currentRoute.value.query?.code,
      clientId: clientId.value,
    }
    try {
      const { data } = await githubInstallAuth(params);
      // data == true 需要install  false 不需要install
      if (data) {
        const state = new Date().getTime();
        const url = `${selectTargetUrl.value}?state=${state}`;
        const myWindow = window.open(url, 'select_target', `modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700,redirect_uri=${apiUrl}/projects/installations`)
      } else {
        // checkSetupAction()
        router.push('/projects/installations')
      }
    } catch (err: any) {

    }
  }
}

// const checkSetupAction = () => {
//   setupAction.value = ''
//   // setupAction === request 阻止  install === 个人
//   if (setupAction.value === 'request') {
//     window.close();
//     const opener = window.opener;
//     opener.postMessage('message', '*');
//   } else {
//     router.push('/adjustPremission');
//   }
// }


onMounted(() => {
  let token = localStorage.getItem('token') || '';
  let loginData = JSON.parse(decodeURIComponent(escape(window.atob(token.split('.')[1]))));
  console.log(loginData, '回调页看登录')
  loginType.value = loginData.loginType;
  if (loginType.value === 1) {
    // checkSetupAction()
  } else {
    initGithubInstallAuth()
  }

})
</script>
<style scoped lang="less">
.metaMaskAuth {
  margin: 0 auto;
  padding-top: 10%;
}
</style>