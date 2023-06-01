<template>
  <div class="flex">
    <div v-for="(item,index) in showUrl">
      <span class="open-link-css">{{ item }}</span>
      <span v-if="index != (showUrl.length-1)"> > </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, toRefs, onMounted } from 'vue';

  const props = defineProps({
    breadcrumbUrl: String
  })
  const { breadcrumbUrl } = toRefs(props)

  const showUrl = ref()
  const handleBreadcrumbUrl = ()=>{
    showUrl.value = breadcrumbUrl?.value?.split('/').slice(1)
    console.log('handleBreadcrumbUrl:',showUrl.value)

    // url截取?之前的字符
    // let interceptStr  = string.replace(/\?(\S*)/, "")
  }

  onMounted(()=>{
    handleBreadcrumbUrl()
  })
</script>