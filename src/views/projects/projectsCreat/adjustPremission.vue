<template>
  <div class="adjustPremission">
    <div class="text-[26px] font-bold text-center">Installation Requested</div>
    <div class="text-left text-[18px]">
      Because you're a member of the GitHub organization that you tried to install Vercel's GitHub App on, you first need
      to
      wait for an owner of the GitHub organization to approve your installation request.
    </div>
    <div class="text-left text-[18px]">They just received an email notification from GitHub, in which they are prompted to
      approve your installation
      request.
      Once they've done that, the GitHub organization will automatically show up in the list of Git namespaces that you
      have
      access to on Hamster.</div>
    <a-button goust class="px-[10px] px-[6px] mt-[30px]" @click="closeBtn">Close window</a-button>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router"
const router = useRouter();
// import.meta.env.VITE_BASE_API
const apiUrl = ref(import.meta.env.VITE_HAMSTER_URL)
const closeBtn = () => {
  const opener = window.opener
  // opener.postMessage('message', apiUrl.value);
  window.close();
  opener.location.reload();
}
</script>

<style scoped lang="less">
.adjustPremission {
  margin: 0 10% 0;
  padding-top: 10%;
}
</style>