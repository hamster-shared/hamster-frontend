<template>
    <a-modal v-model:visible="props.visible" width="1000px" :footer="null" @ok="handleOk" @cancel="handleCancel">
       <div>
            <div>
                <h2>Configure Check Tools</h2>
                <p class="prop">Please select the appropriate tool to check the contract</p>
            </div>
            <div class="center">
                <p>If you need to modify this configuration later,you can modufy it by setting button on thie project details page</p>
            </div>

            <div v-for="item in newArray" :key="item.id" style="display:inline-block;width:100%;">
                <h1>{{item.title}}</h1>
                <div class="box" v-for="(items,index) in item.children" :key="index" style="white-space:nowrap;">
                    <p :class="myArray.includes(items.title) ? 'tags' : 'tag'"
                        style="float:left;width:210px;height:50px;line-height:50px;margin-right:10px;vertical-align:middle;text-align:center;"
                        :style="{border:items.border? '1px solid red':''}"
                        @click="handleClick(items.title)">
                        {{items.title }}
                    </p>
                </div>
            </div>
            <button @click="handleDone">Done</button>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { toRefs,ref,onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const emit = defineEmits(["getDoneData","handleCancel"])
//空数组
const myArray=ref<string[]>([])
const props = defineProps({
        visible:{
            type:Boolean,
            default:false
        },
        selectData:{
            type:Array,
            default:[]
        }
    });
//点击每一项
function handleClick(title:string){
    myArray.value.push(title)    
}
//Done按钮
 function handleDone(){
    emit('getDoneData',myArray.value)
    emit('handleCancel')
}

//数据
const newArray=ref([
{
    title:'Security Analysis',
    id:1,
    children:[
        {
            title:'Mythril',
            border:false
        },
        {
            title:'MetaTrustSecurity Analyzer',
            border:false
        },
        {
            title:'MetaTrustSecurity Prover',
            border:false
        }
    ]
},
{
    title:'Open Source Analysis',
    id:2,
    children:[
        {
            title:'MetaTrustOpen Source Analyzer',
            border:false
        }
    ]
},
{
    title:'Code Quality Analysis',
    id:3,
    children:[
        {
            title:'Solhint',
            border:false
        },
        {
            title:'MetaTrustCode Quality',
            border:false
        }
    ]
},
{
    title:'Gas Usage Analysis',
    id:4,
    children:[
        {
            title:'eth-gas-reporter',
            border:false
        }
    ]
},
{
    title:'Other Analysis',
    id:5,
    children:[
        {
            title:'AI',
            border:false
        }
    ]
}
])

const { PoproverInfo } = toRefs(props)
const requestCall = ref<{
    tool: string,
    toolType: number,
  }[]>([])
</script>

<style lang="less" scoped>
.box{
    background-color: #000;
}
.tag{
    cursor: pointer;
    border:1px solid #ccc;
}
.tags {
    cursor: pointer;
    border: 2px solid #607BD2;
}
.center{
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #BAE2FF;
    padding-left: 15px;
}
button{
    width: 100px;
    height: 30px;
    color: #fff;
    left: 80%;
    background-color: #607BD2;
    border: none;
}
</style>>
