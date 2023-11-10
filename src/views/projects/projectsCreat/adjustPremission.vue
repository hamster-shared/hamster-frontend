<template>
  <div>
    <div class="text-[24px] font-bold text-center">Installation Requested</div>
    <div class="text-left text-[16px]">
      Because you're a member of the GitHub organization that you tried to install Vercel's GitHub App on, you first need
      to
      wait for an owner of the GitHub organization to approve your installation request.
    </div>
    <div>They just received an email notification from GitHub, in which they are prompted to approve your installation
      request.
      Once they've done that, the GitHub organization will automatically show up in the list of Git namespaces that you
      have
      access to on Hamster.</div>
    <a-button goust class="px-[10px] px-[6px] mt-[30px]" @click="closeBtn">Close window</a-button>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";

const closeBtn = () => {
  window.close();
}
</script>