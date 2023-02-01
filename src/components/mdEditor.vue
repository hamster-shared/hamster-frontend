
<template>
  <md-editor v-model="text" :theme="theme.themeValue" previewOnly />
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore()

const props = defineProps({
  text: {
    type: String,
    default: '',
  }
});

const { text } = toRefs(props);
</script>
<style lang="less" scoped>
#md-editor-v3 {
  padding: 24px;
  border-radius: 12px;

  h3 {
    font-weight: 700 !important;
  }
}
</style>