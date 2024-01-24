<template>
    <div class="flex justify-between h-[156px] items-center rounded-[12px] p-[32px] dark:bg-[#1D1C1A] bg-[#ffffff]">
        <div class="flex items-center">
            <svg-icon name="node-Service" size="108" />
            <div class="inline-block ml-[30px]">
                <div class="text-[18px] font-bold">
                    Hamster Node Service
                </div>
                <div class="text-[16px]">
                    <span>{{ orderInfo.resourceType }}</span>
                </div>
                <div class="text-[16px]">
                    {{ orderInfo.buyTime }} Month
                </div>
            </div>
        </div>
        <div v-if="payMethod == 1" class="text-[24px] font-blod text-[#E2B578]">${{ orderInfo.amount }}</div>
        <div v-if="payMethod == 2">
            <div class="text-[24px] font-blod text-[#E2B578]">￥{{ (orderInfo.amount * 7).toFixed(2) }}</div>
            <div class="text-[16px] font-blod text-[#8D8D8D]">(${{ orderInfo.amount }})</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineProps, toRefs } from 'vue';
const props = defineProps({
    orderInfo: {
        type: Object,
        default: {}
    },
    payMethod: {
        type: Number,
        default: null,
    }
})
const { orderInfo, payMethod } = toRefs(props);
</script>
<style lang="less"></style>