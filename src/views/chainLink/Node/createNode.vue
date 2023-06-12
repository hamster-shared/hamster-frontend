<template>

  <bread-crumb :routes="breadCrumbInfo"/>
  <nodeService pageType="create"></nodeService>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BreadCrumb from "@/components/BreadCrumb.vue";
import nodeService from "@/views/chainLink/miwaspace/components/nodeService.vue"


const breadCrumbInfo = ref<any>([])

onMounted(async() => {
  breadCrumbInfo.value = [
    {
      breadcrumbName:'Node',
      path:'/middleware/dashboard/node'
    },
    {
      breadcrumbName: 'Launch Node',
      path:''
    },
  ]
})
</script>
<style lang="less" scoped></style>