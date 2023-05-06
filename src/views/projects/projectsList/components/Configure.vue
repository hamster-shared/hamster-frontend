<template>
    <a-modal v-model:visible="props.visible" width="800px" :footer="null" @cancel="closeEVMToolsModal">
       <div>
            <div>
                <h1 style="font-size:24px;">Configure Check Tools</h1>
                <p class="prop">Please select the appropriate tool to check the contract</p>
            </div>
            <div class="center">
                <p>If you need to modify this configuration later,you can modify it by setting button on the project details page</p>
            </div>

            <div v-for="item in newArray" :key="item.id" style="display:inline-block;width:100%;">
                <p style="font-weight:500;font-size:14px;margin-top:10px;">{{item.title}}</p>
                <div class="box" v-for="(items,index) in item.children" :key="index" style="white-space:nowrap;">
                    <p
                        class="tool-tab"
                        :style="{color:items.border?'#E2B578' : '',border:items.border? '1px solid #E2B578':'1px solid #ccc' }"
                        @click="handleClick(items)"
                        >
                        {{items.title }}
                    </p>
                </div>
            </div>
            <a-button @click="handleDone">Done</a-button>
        </div>
    </a-modal>
</template>
<script lang="ts" setup>
import { toRefs,ref,onMounted } from 'vue'
import { useRoute } from 'vue-router'
const destroyOnClose=ref()
const route = useRoute()
const emit = defineEmits(["getDoneData","handleCancel"])
const myArray=ref<any>([])
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
//数据
const newArray=ref<any>([
{
    title:'Security Analysis',
    id:1,
    children:[
        {
            title:'Mythril',
            border:false
        },
        {
            title:'MetaTrust Security Analyzer',
            border:false
        },
        {
            title:'MetaTrust Security Prover',
            border:false
        }
    ]
},
{
    title:'Open Source Analysis',
    id:2,
    children:[
        {
            title:'MetaTrust Open Source Analyzer',
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
            title:'MetaTrust Code Quality',
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

const getTagClass=(item:any)=>{
    return myArray.value.includes(item.title)? "tags":"tag"
}

const getSelectTools=()=>{
    myArray.value=props.selectDatas
    newArray.value.map((item:any)=>{
        item.children.map((en:any)=>{
            if(props.selectData?.indexOf(en.title)!=-1){
                en.border=true
            }
        })
    })
}

//点击每一项
function handleClick(items:any){
    items.border=!items.border
    //去重
    if(!myArray.value.includes(items.title)){
        myArray.value.push(items.title)
    }
    else{
        const index=myArray.value.indexOf(items.title)
        myArray.value.splice(index,1)
        items.border=false
    }
    console.log(items,'items');
    
    //如果当前选项已经被选中，则从myArray 数组中移除该选项
    if(items.border===false && myArray.value.includes(items.title)){
        const index=myArray.value.indexOf(items.title)
        myArray.value.splice(index,1)
    }
    console.log(11111, myArray.value)
}
//Done按钮
function handleDone(){
    emit('getDoneData',myArray.value)
    emit('handleCancel')
}
const closeEVMToolsModal = ()=>{
    newArray.value.map((item:any)=>{
        item.children.map((en:any)=>{
            en.border = false;
        })
        return item
    })
    myArray.value = []
    emit('handleCancel')
}
onMounted(()=>{
    getSelectTools()
})

</script>

<style lang="less" scoped>
.prop p{
    color: #73706E;
}
.box{
    background-color: #000;
}
.tag{
    cursor: pointer;
    border:1px solid #ccc;
}
.tags {
    cursor: pointer;
    border: 2px solid #E2B578;
    color: #E2B578;
}
.center{
    width: 750px;
    height: 78px;
    line-height: 78px;
    background-color: #FFF9F2;
    padding-left: 15px;
    border-radius: 8px;
    font-size: 14px;
    // border: 1px solid #E2B578;
    font-weight: 500;
    flex-wrap: wrap;
}
button{
    width: 100px;
    height: 40px;
    color: #fff;
    left: 80%;
    background-color: #E2B578;
    border: none;
    border-radius: 8px;
    left: 50%;
    right: 50%;
}
.tool-tab{
    float:left;
    width:220px;
    height:50px;
    line-height:50px;
    margin-right:10px;
    vertical-align:middle;
    text-align:center;
    font-weight:600;
    border-radius:8px;
    cursor:pointer;
    &:hover{
        color:#E2B578;
    }
}
</style>
