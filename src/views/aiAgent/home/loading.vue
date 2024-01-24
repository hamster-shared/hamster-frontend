<template>
  <div class="h-[500px] flex justify-center items-center">
    <a-spin :indicator="indicator" />
  </div>
</template>
<script lang="ts" setup>
import { LoadingOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '44px',
  },
  spin: true,
});
</script>

