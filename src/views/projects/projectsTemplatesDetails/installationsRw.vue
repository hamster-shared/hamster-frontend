<template>
  <div class="text-center installations">
    <div class="text-[20px] font-bold mb-[20px]">Please wait...</div>
    <a-spin />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { appGithubInstall } from "@/apis/projects";
const router = useRouter();
const setupAction = ref('');
const code = ref('');
const apiUrl = ref(import.meta.env.VITE_HAMSTER_URL)

const checkSetupAction = async () => {
  // setupAction === request 组织  install === 个人
  await initAppGithubInstall();
  if (setupAction.value == 'request') {
    console.log('进入request')
    router.push('/projects/adjustPremission');
  } else {
    console.log('进入install')
    const opener = window.opener;
    // opener.postMessage('message', '*');
    window.close();
    opener.location.reload();
  }
}

const initAppGithubInstall = async () => {
  code.value = router.currentRoute.value.query?.code || ''
  const { data } = await appGithubInstall(code.value);
}

onMounted(() => {
  setupAction.value = router.currentRoute.value.query?.setup_action || '';
  console.log(setupAction.value, 'setupAction value')
  checkSetupAction()
})

</script>

<style scoped lang="less">
.installations {
  margin: 0 auto;
  padding-top: 10%;
}
</style>