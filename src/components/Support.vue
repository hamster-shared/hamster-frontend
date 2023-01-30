<template>
  <a target="_blank" href="https://discord.gg/rs9BmXtQah">
    <div class="fixed right-0 top-[50%] -mt-[57px] z-10 mr-4">
      <img
        src="@/assets/images/support.png"
        class="w-[88px] h-[88px]"
        @click="getSupport"
      />
    </div>
  </a>
</template>
<script lang="ts" setup>

const getSupport = () => {
  console.log("get support ...");
}
</script>