<template>
    <a-modal v-model:visible="props.visible" width="1000px" :footer="null" @ok="handleOk">
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
import { defineComponent, onMounted, toRefs,ref,computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const bgColor = ref('')
const emit = defineEmits(["getDoneData"])
//空数组
const myArray=ref<string[]>([])
const props = defineProps({
        visible:{
            type:Boolean,
            default:false
        }
    });
//点击每一项
function handleClick(title:string){
    myArray.value.push(title)    
}
//Done按钮
 function handleDone(){
    emit('getDoneData',myArray.value)
}

//数据
const newArray=ref([
{
    title:'Security Analysis',
    id:1,
    children:[
        {
            title:'Mythril',
        },
        {
            title:'MetaTrustSecurity Analyzer',
        },
        {
            title:'MetaTrustSecurity Prover',
        }
    ]
},
{
    title:'Open Source Analysis',
    id:2,
    children:[
        {
            title:'MetaTrustOpen Source Analyzer',
        }
    ]
},
{
    title:'Code Quality Analysis',
    id:3,
    children:[
        {
            title:'Solhint',
        },
        {
            title:'MetaTrustCode Quality',
        }
    ]
},
{
    title:'Gas Usage Analysis',
    id:4,
    children:[
        {
            title:'eth-gas-reporter',
        }
    ]
},
{
    title:'Other Analysis',
    id:5,
    children:[
        {
            title:'AI',
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
