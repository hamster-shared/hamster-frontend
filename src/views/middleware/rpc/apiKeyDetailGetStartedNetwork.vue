<template>
    <a-image :src="ecosystemDetailInfo.ecosystemIcon" :width="50" :preview="false"/>
    <label>{{ecosystemDetailInfo.ecosystemCode}}</label>
    <a-select @change="onChange">
        <a-select-option v-for="network in ecosystemDetailInfo.networkDetailInfoList" :key="network.code" :value="network.code">{{network.code}}</a-select-option>
    </a-select>

    <div>
        <p>HTTPS</p>
        <p><input type="text"  :value="selectedNetwork.httpsUrl"/></p>
        <p>WSS</p>
        <p><input type="text" :value="selectedNetwork.wssUrl" /></p>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";

const props = defineProps({
    ecosystemDetailInfo: {
        type: Object,
        required: true
    }
})

const value = ref(props.ecosystemDetailInfo.networkDetailInfoList[0].code);
const selectedNetwork = ref({})

const onChange = (newVal:string) => {
    debugger
    selectedNetwork.value = props.ecosystemDetailInfo.networkDetailInfoList.find((t: any) => t.code === newVal)
}

selectedNetwork.value = props.ecosystemDetailInfo.networkDetailInfoList.find((t: any) => t.code === value.value)

</script>



<style scoped lang="less">

</style>
