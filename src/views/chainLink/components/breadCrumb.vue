<template>
  <div class="flex">
    <div v-for="(item,index) in showUrl">
      <span>{{ item }}</span>
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
  }

  onMounted(()=>{
    handleBreadcrumbUrl()
  })
</script>