<template>
  <div class="text-center installations">
    <div class="text-[20px] font-bold mb-[20px]">Please wait...</div>
    <a-spin />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
// import { githubInstallAuth } from "@/apis/login";
const router = useRouter();
const setupAction = ref('');
const loginType = ref();
const clientId = ref(import.meta.env.VITE_APP_CLIENTID);
const selectTargetUrl = ref(import.meta.env.VITE_OAUTH_URL);


// const initGithubInstallAuth = async () => {
//   if (router.currentRoute.value.query?.code) {
//     const params = {
//       code: router.currentRoute.value.query?.code,
//       clientId: clientId.value,
//     }
//     try {
//       const { data } = await githubInstallAuth(params);
//       // data == true 需要install  false 不需要install
//       if (data) {
//         const state = new Date().getTime();
//         const url = `${selectTargetUrl.value}?state=${state}`;
//         const myWindow = window.open(url, 'select_target', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
//       } else {
//         checkSetupAction()
//       }
//     } catch (err: any) {

//     }
//   }
// }

const checkSetupAction = () => {

  // setupAction === request 组织  install === 个人
  if (setupAction.value === 'install') {
    window.close();
    const opener = window.opener;
    opener.postMessage('message', '*');
  } else {
    router.push('/adjustPremission');
  }
}
onMounted(() => {
  setupAction.value = router.currentRoute.value.query?.setup_action || '';
  console.log(setupAction.value, 'setupAction value')
  checkSetupAction
  // let token = localStorage.getItem('token') || '';
  // let loginData = JSON.parse(decodeURIComponent(escape(window.atob(token.split('.')[1]))));
  // console.log(loginData, '回调页看登录')
  // loginType.value = loginData.loginType;
  // if (loginType.value === 1) {
  //   checkSetupAction()
  // } else {
  //   initGithubInstallAuth()
  // }

})
</script>

<style scoped lang="less">
.installations {
  margin: 0 auto;
  padding-top: 10%;
}
</style>