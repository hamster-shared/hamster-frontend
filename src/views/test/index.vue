<template>
  <div>test</div>
  <a-button @click="showNew">test-login</a-button>
</template>
<script lang='ts' setup>
const showNew = () => {
  window.open('/login', '_parent', 'width=400,height=400')
}
</script>
<style lang='scss' scoped>

</style>