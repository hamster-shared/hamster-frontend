<template>
  <div class="text-center installations">
    <div class="text-[20px] font-bold mb-[20px]">Please wait...</div>
    <a-spin />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getUserInfo, githubInstallAuth, getUserInfoById } from "@/apis/login";
const loginType = ref();
const router = useRouter();
const apiUrl = ref(import.meta.env.VITE_HAMSTER_URL)
const clientId = ref(import.meta.env.VITE_APP_CLIENTID);
const selectTargetUrl = ref(import.meta.env.VITE_OAUTH_URL);
const channel = new BroadcastChannel("updateUserInfo");

const getUserInfoData = async () => {
  const { data } = await getUserInfo()
  console.log(data, 'data')
  if (data) {
    getMetaMaskUserInfo(data.userId)

  }
}

const getMetaMaskUserInfo = async (id: string) => {
  const { data } = await getUserInfoById(id);
  if (data) {
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('test', 'test connect gIthub后更新的userInfo')
    console.log(data, 'connect gIthub后更新的userInfo， 有username吗？')
    channel.postMessage('update')
    window.close();

    // window.opener.location.reload();

  }
}

const initGithubInstallAuth = async () => {
  if (router.currentRoute.value.query?.code) {
    const params = {
      code: router.currentRoute.value.query?.code,
      clientId: clientId.value,
    }
    try {
      const { data } = await githubInstallAuth(params);
      // data == true 需要install  false 不需要install
      getUserInfoData();

    } catch (err: any) {

    }
  }
}

onMounted(() => {
  let token = localStorage.getItem('token') || '';
  if (token) {
    let loginData = JSON.parse(decodeURIComponent(escape(window.atob(token.split('.')[1]))));
    console.log(loginData, 'connectGithub回调页')
    loginType.value = loginData.loginType;
    if (loginType.value == 2) {
      initGithubInstallAuth()

    }
  }
})

</script>

<style scoped lang="less">
.installations {
  margin: 0 auto;
  padding-top: 10%;
}
</style>