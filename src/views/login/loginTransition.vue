<template>
  <div class="text-[16px] text-center login-transition">
    <div class="text-[20px] font-bold mb-[12px]">Authenticating</div>
    <div>Hamster is validating your identity</div>
    <div class="mb-[8px]">Please wait...</div>
    <a-spin />
  </div>
</template>
<script lang='ts' setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { login, getUserInfo } from "@/apis/login";

const router = useRouter();
const code = ref('');
const clientId = ref(import.meta.env.VITE_APP_CLIENTID);

const githubLogin = async () => {
  try {
    const { data } = await login({ code: code.value });
    if (data) {
      localStorage.setItem('token', data);
      getUserInfoData()
    }
  } catch (err: any) {
    message.error(err.message);
  }
}

const getUserInfoData = async () => {
  try {
    const { data } = await getUserInfo();
    console.log(data, 'github登录的data')
    localStorage.setItem('userInfo', JSON.stringify(data));
    window.close();
    window.opener.location.reload();
  } catch (err: any) {
    window.close();
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    router.push('/');
    message.error(err.message);
  }
}

onMounted(async () => {
  if (localStorage.getItem('token')) {
    if (localStorage.getItem('firstState') === "0" && false) {
      //第一次登录
      router.push('/welcome')
    } else {
      router.push('/projects')
    }
  } else {
    code.value = router.currentRoute.value.query?.code || '';
    githubLogin()
    // const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    // if (JSON.stringify(userInfo) === '{}') {
    //   code.value = router.currentRoute.value.query?.code || '';
    //   if (code.value) {
    //     await githubLogin()
    //   }
    //   // const state = new Date().getTime();
    //   // const oauthUrl = ref(import.meta.env.VITE_OAUTH_URL);
    //   // const url = `${oauthUrl.value}?state=${state}`;
    //   // const myWindow = window.open(url, '_parent', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
    // } else {
    //   if (userInfo.token) {
    //     localStorage.setItem('token', userInfo.token);
    //     window.close();
    //     window.opener.location.reload();
    //   } else {
    //     code.value = router.currentRoute.value.query?.code || '';
    //     if (code.value) {
    //       githubLogin()
    //     }
    //   }
    // }
  }
})
</script>
<style lang='less' scoped>
.login-transition {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>