<template>
  <div class="text-center installations">
    <div class="text-[20px] font-bold mb-[20px]">Please wait...</div>
    <a-spin />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const setupAction = ref('');
const apiUrl = ref(import.meta.env.VITE_HAMSTER_URL)

const checkSetupAction = () => {
  // setupAction === request 组织  install === 个人
  if (setupAction.value == 'request') {
    console.log('进入request')
    router.push('/projects/adjustPremission');
  } else {

    console.log('进入install')
    const opener = window.opener;
    // opener.postMessage('message', apiUrl.value);
    window.close();
    opener.location.reload();
  }
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