<template>
    <div>
        <div>
            <h2>Configure Check Tools</h2>
            <p class="prop">Please select the appropriate tool to check the contract</p>
        </div>
        <div class="center">
            <p>If you need to modify this configuration later,you can modufy it by setting button on thie project details page</p>
        </div>
         <!-- <div class="box">
            <h3 class="Hb">Security Analysis</h3>
            <span class="active">Mythril</span>
            <span>MetaTrust Security Analyzer</span>
            <span>MetaTrust Security Prover</span>
        </div>
         <div class="box">
            <h3 class="Hb">Security Analysis</h3>
            <span>MetaTrust Open Source Analyzer</span>
        </div>
         <div class="box">
            <h3 class="Hb">Code Quality Analysis</h3>
            <span>Solhint</span>
            <span>MetaTrust Code Quality</span>
        </div>
         <div class="box">
            <h3 class="Hb">Gas Usage Analysis</h3>
            <span>eth-gas-reporter</span>
        </div>
         <div class="box">
            <h3 class="Hb">Other Analysis</h3>
            <span>AI</span>
        </div> -->
        <div class="tabs">
            <div class="tab-buttons">
                <h2 v-for="(item, index) in requestCall" :key="index">{{ item.tool }}</h2>
            </div>
            <div class="tab-contents">
                <!-- <div v-for="(item, index) in requestCall" :key="index" v-show="selectedTab === index"> -->
                    <button>{{ item.toolType }}</button>
                <!-- </div> -->
            </div>
        </div>
        <button>Done</button>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, toRefs,ref } from 'vue'
import type { PostPopoverType } from "@/apis/workFlows";
import { message } from "ant-design-vue";
import router from "@/router";
import { useRoute } from 'vue-router'
const route = useRoute()
const props = defineProps({
    PoproverInfo:Array
  })

const { PoproverInfo } = toRefs(props)
const requestCall = ref<{
    tool: string,
    toolType: number,
  }[]>([])

//获取数据
const getInter = async()=>{
    try {
      const { data } = await PostPopoverType()
      requestCall.value = data
      console.log('data:',data)
    } catch(err) {
      console.log('err:',err)
    }
  }

onMounted(async () => {
    console.log(route.query.id);
    // 在这里调用接口，参数route.query.id
    await getInter()

})
</script>

<style lang="less" scoped>
.prop{
    color: #C0C0C0;
}
.Hb{
    margin-top: 10px;
    margin-bottom: 20px;
}
.center{
    width: 80%;
    height: 50px;
    line-height: 50px;
    background-color: #77DDFF;
    padding-left: 15px;
}
.box{
    width: 100%;
    height: 80px;
    margin-top: 10px;
}
.box span{
    border: 1px solid #ccc;
    margin-right: 15px;
    padding: 10px;
    margin-top: 20px;
    font-weight: 600;
}
button{
    width: 100px;
    height: 30px;
    color: #fff;
    left: 80%;
    background-color: skyblue;
    border: none;
}
</style>>
