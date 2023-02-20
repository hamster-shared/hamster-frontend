<template>
  <div>test</div>
  <a-button @click="showNew">test-login</a-button>

  <a-button @click="close">close window</a-button>
</template>
<script lang='ts' setup>
import { message } from "ant-design-vue";
const showNew = () => {
  window.open('/login', '_parent', 'width=400,height=400')
}

const close = () => {
  message.info('登录失败');
  window.close()
}
</script>
<style lang='scss' scoped>

</style>