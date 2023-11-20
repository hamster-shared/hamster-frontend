<template>
  <div class="mt-4 dark:bg-[#1D1C1A] bg-[#FFFFFF] rounded-[16px] py-[24px] px-[32px]">
    <div class="text-[24px] font-bold inline-block">{{name}}
      <div
        class="inline-block ml-4 text-[14px] rounded-[32px] py-1 px-4 border border-solid dark:border-[#434343] border-[#EBEBEB]">
        <label>EVM</label>
      </div>
    </div>
    <div class="mt-[32px] mb-[20px]">Contract Version</div>
    <a-select ref="select" v-model:value="selectedVersion" style="width: 50%" :disabled="route.query?.version"
      :options="versionList.map(item => ({ value: item }))" @select="getSourceInfo">
    </a-select>
    <div class="text-[16px] font-bold mt-[30px] mb-[20px]">Source Info</div>
    <div class="text-[14px]">
      <img src="@/assets/images/link.png" class="h-[17px] mr-[10px] hidden dark:inline-block" />
      <img src="@/assets/images/link-white.png" class="h-[17px] mr-[10px] dark:hidden" />
      {{info.url}}
    </div>
    <div class="mt-[10px] text-[14px]">
      <img src="@/assets/images/info.png" class="h-[17px] mr-[10px] hidden dark:inline-block" />
      <img src="@/assets/images/info-white.png" class="h-[17px] mr-[10px] dark:hidden" />
      {{info.codeInfo}}
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted } from "vue";
import { useRoute } from "vue-router";
import { apiSourceInfo } from '@/apis/contractOrchestrationDeploy'
import { message } from "ant-design-vue";
const selectedVersion = ref<string>('');
const props = defineProps({
  versionList:{
    type:Array,
    default:()=>[]
  },
  name:{
    type:String,
    defalut:''
  },
  id:{
    type:String,
    default:''
  }
})
const { versionList, name, id } = toRefs(props)
const route = useRoute()
const info = ref<any>({})

const emit = defineEmits(['getProjectsContractName'])

// 获取头部信息
const getSourceInfo = async()=>{
  try {
    const res = await apiSourceInfo(route.query.id, selectedVersion.value)
    console.log('获取头部信息:',res)
    info.value = res.data
    // emit('getProjectsContractName')
  } catch (error:any) {
    message.error(error)
  }
}

onMounted(()=>{
  // 版本号倒序，默认取数组第一项
  selectedVersion.value = route.query?.version || versionList.value[0]
  console.log('版本号倒序，默认取数组第一项:',selectedVersion.value)
  getSourceInfo()
})

defineExpose({
  selectedVersion,
})
</script>

<style lang="less" scoped></style>