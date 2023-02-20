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
import { apiLogin, apiGetUser, apiInstall } from "@/apis/login";

const router = useRouter();
const code = ref('');
const clientId = ref(import.meta.env.VITE_APP_CLIENTID);


const login = async () => {
  try {
    const { data } = await apiLogin({ code: code.value, clientId: clientId.value });
    localStorage.setItem('firstState', data.firstState.toString());
    localStorage.setItem('userInfo', JSON.stringify(data));
    // localStorage.setItem('token', data.token);
    // console.log("login:", data);
  } catch (err: any) {
    window.close();
    localStorage.removeItem('userinfo');
    router.push('/');
    message.error(err.message);
  } finally {
    // getUser();
  }

}

// const getUser = async () => {
//   try {
//     const { data } = await apiGetUser();
//     // console.log("getUser:", data);
//     localStorage.setItem('firstState', data.firstState.toString());
//     localStorage.setItem('userInfo', JSON.stringify(data));
//   } catch (error: any) {
//     console.log("erro:", error)
//   } finally {
//     window.close();
//     window.opener.location.reload();
//   }
// }

const installGitHub = async () => {
  try {
    const { data } = await apiInstall();
    localStorage.setItem('token', data.token);
    window.close();
    window.opener.location.reload();
  } catch (err: any) {
    window.close();
    localStorage.removeItem('userinfo');
    router.push('/');
    console.log('err:', err)
  }
}



onMounted(async () => {
  if (localStorage.getItem('token')) {
    if (localStorage.getItem('firstState') === "0") {
      //第一次登录
      router.push('/welcome')
    } else {
      router.push('/projects')
    }
  } else {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    if (JSON.stringify(userInfo) === '{}') {
      code.value = router.currentRoute.value.query?.code || '';
      if (code.value) {
        await login()
      }

      const state = new Date().getTime();
      const oauthUrl = ref('https://github.com/apps/hamster-test/installations/new');
      const url = `${oauthUrl.value}?state=${state}`;
      const myWindow = window.open(url, 'login-github', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
    } else {
      code.value = router.currentRoute.value.query?.code || '';
      if (code.value) {
        installGitHub(code.value)
      }
    }
  }


  // if (localStorage.getItem('token')) {
  //   console.log("firstState:", localStorage.getItem('firstState'), localStorage.getItem('firstState') === "0", localStorage.getItem('firstState') === "1");
  //   if (localStorage.getItem('firstState') === "0") {
  //     //第一次登录
  //     router.push('/welcome')
  //   } else {
  //     router.push('/projects')
  //   }
  // } else {
  //   code.value = router.currentRoute.value.query?.code;
  //   if (code.value) {
  //     login()
  //   }
  // }
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