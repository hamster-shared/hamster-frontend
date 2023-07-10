<template>
  <a-modal v-model:visible="props.visible" width="1300px" :footer="null" @cancel="closeEVMToolsModal">
    <template #closeIcon>
        <img class="" src="@/assets/icons/closeIcon.svg" @click="closeEVMToolsModal"/>
    </template>
    <div class="flex m-[-24px]">
      <div class="p-[32px] w-3/5">
        <div>
          <h1 style="font-size:24px;">Configure Check Tools</h1>
          <p class="prop">Please select the appropriate tool to check the contract</p>
        </div>
        <div class="center">
          If you need to modify this configuration later, you can modify it by setting button on the project details page
        </div>
        <div v-for="item in newArray" :key="item.id" style="display:inline-block;width:100%;">
          <p style="font-weight:500;font-size:14px;margin-top:10px;">{{item.title}}</p>
          <div class="flex">
            <div class="box" v-for="(items,index) in item.children" :key="index">
              <p
                  class="tool-tab"
                  :style="{color:items.border?'#E2B578' : '',border:items.border? '2px solid #E2B578':'' }"
                  @click="handleClick(items)"
                  @mouseover="hoverFn(items)"
                  @mouseleave="leaveFn"
                  >
                  {{items.title }}
              </p>
            </div>
          </div>
        </div>
        <div class="text-center mt-[16px]">
          <a-button @click="handleDone">Done</a-button>
        </div>
      </div>
      <div class="right-card p-[32px]">
        <div class="right-bg relative w-full">
          <img v-if="isDefault" src="@/assets/images/default-metatrust-bg-logo.png" class="h-[420px] absolute right-0 bottom-[99px]" />
          <img v-else-if="!toolInfo.isMetatrust" src="@/assets/images/no-metatrust-bg-logo.png" class="h-[420px] absolute right-0 bottom-[99px]" />
          <img v-else-if="toolInfo.isMetatrust" src="@/assets/images/metatrust-bg-logo.png" class="h-[420px] absolute right-0 bottom-[99px]" />
          <div class="px-[37px] pt-[50px] overflow-auto h-[600px]">
            <div v-if="isDefault">
              <div class="text-[24px] font-bold mb-[40px]">How to check Contract</div>
              <div class="text-[18px] leading-[24px] text-[#73706E] flex">
                <div>
                  <div class="rounded-num">1</div>
                </div>
                <div>
                  <div class="font-medium text-[#000000]">Configure Check Tools(first time)</div>
                  <div class="mt-[10px]">Hamster provides a plug-and-play workflow, leveraging auditing and inspection tools to comprehensively secure smart contracts. Please configure the necessary tools as required.</div>
                </div>
              </div>
              <div class="mt-[30px] text-[18px] leading-[24px] text-[#73706E] flex">
                <div>
                  <div class="rounded-num">2</div>
                </div>
                <div>
                  <div class="font-medium text-[#000000]">Click ”Check” Button</div>
                  <div class="mt-[10px]">After completing the configuration, click "check" to start the automatic check workflow. For subsequent executions, no configuration change is required; you can start directly from this step.</div>
                </div>
              </div>
              <div class="mt-[30px] text-[18px] leading-[24px] text-[#73706E] flex">
                <div>
                  <div class="rounded-num">3</div>
                </div>
                <div>
                  <div class="font-medium text-[#000000]">View Check Report</div>
                  <div class="mt-[10px]">Once the check has been executed, the output from all check tools will be aggregated into a single check report. You can review and improve the security and stability of the contract based on this report.</div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="text-[24px] font-bold mb-[40px]">{{toolInfo.title}}</div>
              <div class="text-[14px] text-[#73706E]" style="text-align: justify; text-justify: inter-word;">{{toolInfo.description}}</div>
              <div v-if="toolInfo.content.length" class="mt-[20px] text-[14px] text-[#73706E] flex" v-for="(item,index) in toolInfo.content">
                <div :class="toolInfo.isMetatrust ? 'text-[#F97315]':'text-[#E2B578]'" class="text-[100px] leading-[8px] mr-1">·</div>
                <div>{{item}}</div>
              </div>
            </div>
          </div>
          <div v-if="toolInfo.isMetatrust && !isDefault" class="text-[#E63E1E] font-medium text-[14px] absolute right-[37px] bottom-[31px]">metatrust.io</div>
        </div>
        <div v-if="toolInfo.isMetatrust && !isDefault" class="font-medium text-right mt-[30px]">
          Powered by
          <img src="@/assets/icons/Metatrust-logo.svg" class="h-[42px] ml-2" />
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { toRefs,ref,onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMetatrustInfoByToolname } from '@/utils/metatrust'
const isDefault = ref(true)
const toolInfo = ref<any>([])
const destroyOnClose=ref()
const route = useRoute()
const emit = defineEmits(["getDoneData", "handleCancel"])
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
    title:'Expanded Analysis',
    id:5,
    children:[
        {
            title:'AI',
            border:false
        }
    ]
}
])

const getSelectTools=()=>{
    if(props.selectData.length){
        myArray.value = props.selectData
    }
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
    console.log('点击每一项',items)
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
    //如果当前选项已经被选中，则从myArray 数组中移除该选项
    if(items.border===false && myArray.value.includes(items.title)){
        const index=myArray.value.indexOf(items.title)
        myArray.value.splice(index,1)
    }
}
// 移动鼠标
const hoverFn = (items:any)=>{
    isDefault.value = false
    toolInfo.value = getMetatrustInfoByToolname(items.title)
}
// 鼠标移出
const leaveFn = ()=>{
    isDefault.value = true
}
//Done按钮
function handleDone(){
    emit('getDoneData',myArray.value)
    emit('handleCancel')
}
// 关闭弹框清楚勾选项
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
    // background-color: #000;
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
    // width: 750px;
    // height: 78px;
    // line-height: 78px;
    background-color: #FFF9F2;
    padding: 15px 20px;
    border-radius: 5px;
    font-size: 14px;
    border: 1px solid #E2B578;
    font-weight: 400;
    flex-wrap: wrap;
}
button{
    width: 100px;
    height: 40px;
    color: #fff;
    // left: 80%;
    background-color: #E2B578;
    border: none;
    border-radius: 8px;
    // left: 50%;
    // right: 50%;
}
.tool-tab{
    // float:left;
    width:200px;
    height:60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right:10px;
    vertical-align:middle;
    text-align:center;
    font-weight:400;
    font-size: 14px;
    border-radius:8px;
    color: #4E4E4E;
    cursor:pointer;
    border: 2px solid #DCDCDC;
    &:hover{
      border-color:#E2B578 !important;
    }
    &:active{
      border-color: #CE9C58 !important;
    }
}
.right-card{
  border-left: 2px solid #F4F4F4
}
.right-bg{
  background: linear-gradient(135deg, #FFFBF7 0%, #FFF0E4 100%);
  border-radius: 8px;
  // padding: 50px 0;
  margin-top: 82px;
  height: 665px;
}
.rounded-num{
  background-color: #E2B578;
  color: #FFFFFF;
  width: 26px;
  height: 26px;
  line-height: 26px;
  border-radius: 50%;
  text-align: center;
  margin-right: 10px;
}
</style>
