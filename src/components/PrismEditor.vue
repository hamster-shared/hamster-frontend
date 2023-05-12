<template>
  <div class="relative">
    <pre :class="'hx-scroll ' + lineNumbers"><code :class="'language-'+ type" v-html="Prism.highlight(code, Prism.languages[type], type)"></code><span v-show="isShowlineNumbers" class="line-numbers-rows"><span v-for="item in lineTotal"></span></span></pre>
  </div>
</template>
<script setup lang="ts">
import { onMounted, computed } from "vue";
import Prism from "prismjs";

const props = defineProps({
  code: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "js",
  },
  isShowlineNumbers: {
    type: Boolean,
    default: true,
  },
  lineTotal: {
    type: Number,
    default: 0,
  },
});
const lineNumbers = computed(() => {
  return props.isShowlineNumbers ? "show-line-numbers" : "";
});
onMounted(() => {
  Prism.highlightAll(); //切换菜单重新渲染
});
</script>
<style scoped lang="less">
:not(pre) > code[class*="language-"], pre[class*="language-"]{
  background-color: transparent;
}
pre[class*="language-"].show-line-numbers{
  padding-left: 4rem;
}
.line-numbers-rows{
  position: absolute;
  pointer-events: none;
  top: 1rem;
  left: 0;
  font-size: 100%;
  width: 3em;
  letter-spacing: -1px;
  border-right: 1px solid #999;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
</style>