<template>
  <div class="text-center">
    <div class="text-[20px] mb-[20px]">Please wait...</div>
    <a-spin />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { githubInstallAuth } from "@/apis/login";
const router = useRouter();

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
      if (!data) {
        // const state = new Date().getTime();
        // const url = `${selectTargetUrl.value}?state=${state}`;
        // const myWindow = window.open(url, 'select_target', 'modal=yes,toolbar=no,titlebar=no,menuba=no,location=no,top=100,left=500,width=800,height=700')
      }
    } catch (err: any) {

    }
  }
}
onMounted(() => {
  initGithubInstallAuth()
})
</script>