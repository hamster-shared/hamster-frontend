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
const apiUrl = ref(import.meta.env.VITE_HAMSTER_URL)
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
        const url = `${selectTargetUrl.value}?state=${state}&redirect_uri=${apiUrl.value}/projects/installations`;
        const myWindow = window.open(url, 'select_target', `modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700`)
        window.close();
      } else {
        // 小狐狸登录情况下，不需要install 
        const opener = window.opener;
        // opener.postMessage('message', apiUrl.value);

        window.close();
        opener.location.reload();
      }
    } catch (err: any) {

    }
  }
}

onMounted(() => {
  initGithubInstallAuth()
})
</script>
<style scoped lang="less">
.metaMaskAuth {
  margin: 0 auto;
  padding-top: 10%;
}
</style>