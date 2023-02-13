<template>
  <div v-if="showMsg" class="ant-message">
    <div>
      <div class="ant-message-notice">
        <div class="message-custom-content ">
          <div class="ant-message-success">
            <span role="img" aria-label="check-circle" class="anticon anticon-check-circle"><svg focusable="false" class="" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></span>
          <span>The workflow of deployment is running, <a :href="`/projects/${msgParam.id}/${msgParam.workflowsId}/workflows/${msgParam.workflowDetailId}/3/${msgParam.projectType}`">view now</a></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, toRefs } from 'vue';
//
const props = defineProps({
  showMsg: Boolean,
  msgParam: Object,
});
const { showMsg, msgParam } = toRefs(props);

const linkVal = "";
</script>
<style scoped  lang='less'>
.message-custom-content {
  background: #FFF9F2;
  border: 1px solid #FFB45B;
  border-radius: 12px;
  color: #000000;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
  display: inline-block;
  padding: 10px 16px;
  pointer-events: all;
}
</style>