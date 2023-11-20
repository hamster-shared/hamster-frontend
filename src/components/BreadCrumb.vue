<template>
    <a-breadcrumb :routes="routes" :separator="separator">
        <template #itemRender="{ route }">
            <span class="font-bold" v-if="routes.indexOf(route) === routes.length - 1">
                {{ route.breadcrumbName }}
            </span>
            <router-link v-else :to="route.path">
                {{ route.breadcrumbName }}
            </router-link>
        </template>
    </a-breadcrumb>
</template>
<script setup lang="ts" name="BreadCrumb">
import { defineProps } from 'vue'
    defineProps({
        routes: {
            type: Array,
            default: () => [],
      },
      separator: {
        type: String,
          default: '/'
        }
    });
</script>
<style scoped lang="less">
</style>