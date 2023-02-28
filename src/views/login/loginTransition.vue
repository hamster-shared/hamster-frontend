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
import { apiLogin, apiInstall,apiGetUser} from "@/apis/login";

const router = useRouter();
const code = ref('');
const clientId = ref(import.meta.env.VITE_APP_CLIENTID);


const login = async () => {
  try {
    const { data } = await apiLogin({ code: code.value, clientId: clientId.value });
    localStorage.setItem('firstState', data.firstState.toString());
    localStorage.setItem('userInfo', JSON.stringify(data));
    if (data.token) {
      localStorage.setItem('token', data.token);
      window.close();
      window.opener.location.reload();
    }
  } catch (err: any) {
    window.close();
    localStorage.removeItem('userInfo');
    router.push('/');
    message.error(err.message);
  }
}


const installGitHub = async () => {
  try {
    const { data } = await apiInstall(code.value);
    localStorage.setItem('token', data);
    window.close();
    window.opener.location.reload();
  } catch (err: any) {
    window.close();
    localStorage.removeItem('userInfo');
    router.push('/');
    console.log('err:', err)
  }
}

const backNumber = localStorage.getItem('backnumber')
const initInstallGithub = ()=>{
  code.value = router.currentRoute.value.query?.code || '';
  if (backNumber == '2' && code.value) {
    installGitHub()
    localStorage.removeItem('backnumber')
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
      const oauthUrl = ref(import.meta.env.VITE_OAUTH_URL);
      const url = `${oauthUrl.value}?state=${state}`;
      const myWindow = window.open(url, '_parent', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
    } else {
      if (userInfo.token) {
        localStorage.setItem('token', userInfo.token);
        const { code } = await apiGetUser();
        if (code == 401) {
          localStorage.removeItem('token')
          code.value = router.currentRoute.value.query?.code || '';
          if (code.value) {
            installGitHub()
          }
        } else {
          window.close();
          window.opener.location.reload();
        }
      } else {
        code.value = router.currentRoute.value.query?.code || '';
        if (code.value) {
          installGitHub()
        }
      }
    }
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