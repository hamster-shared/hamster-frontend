<template>

    <div>111
        <echarts echarts-id="echarts"/>

        {{creditCostLast24}}
    </div>


</template>

<script setup lang="ts">

import {apiZanApiKeyCreditCostLast24} from "@/apis/middlewareRPC"
import {onMounted, ref} from "vue";
import Echarts from "@/components/Echarts.vue";

const creditCostLast24 = ref([])

onMounted(async () => {
    const data = await apiZanApiKeyCreditCostLast24()
    creditCostLast24.value = data
})

</script>

<style scoped lang="less">

</style>
