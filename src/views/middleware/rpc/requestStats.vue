
<template>
    <a-card>
        <div>
            <select >
                <option value="aishow">AiShow</option>
                <option value="bishow">BiShow</option>
            </select>

            <select>
                <option v-for="item in ecosystems" :value="item.ecosystemCode">{{ item.ecosystemName }}</option>
            </select>
            <select>
                <option value="STAT_15_MIN">15 min</option>
                <option value="STAT_1_HOUR">1 hour</option>
                <option value="STAT_24_HOUR">24 hour</option>
                <option value="STAT_7_DAY">7 day</option>
                <option value="STAT_1_MONTH">1 month</option>
            </select>
        </div>

        <div>
            <a-row>
                <a-col :span="18">
                    <div>
                        主echart
                    </div>
                </a-col>
                <a-col :span="6">
                    <a-row>
                        <a-col>
                            <div>第一个圆饼</div>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col>
                            <div>第二个圆饼</div>
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col>
                            <div>第三个圆饼</div>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
    </a-card>
</template>

<script setup lang="ts">

import {apiZanEcosystemsDigest} from "@/apis/middlewareRPC"
import {onMounted, ref} from "vue";

const ecosystems = ref([])

onMounted(() => {
    apiZanEcosystemsDigest().then(res => {
        ecosystems.value = res.data
    })
})

</script>


<style scoped lang="less">

</style>
