
<template>
    <a-card>
        <div>
            <a-select  :value="selectedApiKeyId" @change="changeApp">
                <a-select-option v-for="item in apps" :value="item.apiKeyId">{{ item.name }}</a-select-option>
            </a-select>

            <select :value="selectedEcosystem">
                <option v-for="item in ecosystems" :value="item.ecosystemCode">{{ item.ecosystemName }}</option>
            </select>
            <select :value="selectedTime">
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
                        主echart折线图  "apiZanApiKeyRequestStats"

                        {{mainChart}}
                    </div>
                </a-col>
                <a-col :span="6">
                    <a-row>
                        <a-col>
                            <div>第一个圆饼  Top 5   "apiZanApiKeyRequestStats"</div>
                            {{circlePanel1Top5}}
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col>
                            <div>第二个圆饼    Source    "apiZanApiKeyRequestOriginStats"</div>
                            {{circlePanel2Source}}
                        </a-col>
                    </a-row>
                    <a-row>
                        <a-col>
                            <div>第三个圆饼  Errors   "apiZanApiKeyRequestActivityStats"  </div>
                            {{ circlePanel3Error}}
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </div>
    </a-card>
</template>

<script setup lang="ts">

import {apiZanEcosystemsDigest, apiZanApiKeyRequestStats, apiZanApiKeyRequestOriginStats,apiZanApiKeyRequestActivityStats} from "@/apis/middlewareRPC"
import {onMounted, ref} from "vue";

const props = defineProps({
    apps: {
        type: Object,
        required: true
    }
})

const selectedApiKeyId = ref<string>("")
const selectedEcosystem = ref<string>("ethereum")
const selectedTime = ref<string>("STAT_24_HOUR")
const ecosystems = ref([])
// 主echarts
const mainChart = ref<{ [time: number]: [request: number] }>([])
// 第一个圆饼  Top 5
const circlePanel1Top5 = ref({})
// 第二个圆饼    Source
const circlePanel2Source = ref({})
// 第三个圆饼  Errors
const circlePanel3Error = ref([])

const changeApp = (apiKeyId:string) => {
    console.log(apiKeyId)

    apiZanApiKeyRequestStats(apiKeyId,selectedTime.value,selectedEcosystem.value).then(res => {

        const groupedByTime: { [time: number]: [request: number] } =  res.data.reduce((acc: any,requestStats:any) => {
            const time = requestStats.dataTime
            if (!acc[time]) {
                acc[time] = 0;
            }
            acc[time] += requestStats.num
            return acc;
        }, {})

        mainChart.value = groupedByTime

        const groupedByMethod: { [method: string]: [request: number] } =  res.data.reduce((acc: any,requestStats:any) => {
            const method = requestStats.method
            // debugger
            // if (!acc[method]) {
            //     acc[method] = 0;
            // }
            let num = acc.get(method) || 0
            num += requestStats.num
            acc.set(method, num);
            return acc;
        }, new Map<string,number>())


        circlePanel1Top5.value = groupedByMethod
    })

    apiZanApiKeyRequestActivityStats(apiKeyId,selectedTime.value,selectedEcosystem.value).then(res => {

        const successFailData = res.data.reduce((acc:any, item:any) => {
            acc.successNum += (item.totalNum - item.failedNum)
            acc.failedNum += item.failedNum
            return acc
        }, {
            "successNum": 0,
            "failedNum": 0,
        })

        console.log(successFailData)

        circlePanel3Error.value = successFailData
    })

    apiZanApiKeyRequestOriginStats(apiKeyId,selectedTime.value).then(res => {


        const httpsWssData = res.data.reduce((acc:any,item:any)=> {
            acc.httpsNum += item.httpsNum
            acc.wssNum += item.wssNum
            return acc
        }, {
            httpsNum: 0,
            wssNum:0,
        })

        // console.log(httpsWssData)

        circlePanel2Source.value = httpsWssData
    })


}


onMounted(() => {
    apiZanEcosystemsDigest().then(res => {
        ecosystems.value = res.data
    })
})

</script>


<style scoped lang="less">

</style>
