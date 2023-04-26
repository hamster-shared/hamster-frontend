<template>
    <div>
        <div>
            <h2>Configure Check Tools</h2>
            <p class="prop">Please select the appropriate tool to check the contract</p>
        </div>
        <div class="center">
            <p>If you need to modify this configuration later,you can modufy it by setting button on thie project details page</p>
        </div>

        <div v-for="item in newArray" :key="item.id" style="display:flex">
            <h1 style="width:250px;height:30px;margin-bottom:10px">{{item.title}}</h1>
            <div v-for="(items,index) in item.children" :key="index">
              <p class="p"
                :style="{ backgroundColor: bgColor }"
                @click="handleClick(items.title)"
                style="cursor: pointer;border:1px solid #ccc;width:220px;height:95px;text-align:center;line-height:95px;margin-top:30px;margin-right:10px"
              >
                 {{items.title }}
              </p>
            </div>
        </div>
        <button @click="handleDone">Done</button>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, toRefs,ref } from 'vue'
import  { apiPostPopover } from "@/apis/workFlows";
import { useRoute } from 'vue-router'

//空数组
const myArray=ref<string[]>([])

const route = useRoute()
const props = defineProps({
    PoproverInfo:Array
  })
  const bgColor = ref('')
  const isBorderOn=ref(false)
//点击每一项
function handleClick(title:string){

    bgColor.value = bgColor.value === 'white' ? 'pink' : 'white'
    myArray.value.push(title)
}

//Done按钮
async function handleDone(){
    console.log(myArray.value,'点击的每一项的合计');
    const res = await apiPostPopover(route.query.id as string,myArray as any)
    console.log(res,'done按钮接口数据');

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
// const visible=ref(false)
const { PoproverInfo } = toRefs(props)
const requestCall = ref<{
    tool: string,
    toolType: number,
  }[]>([])

//点击事件
// const handleInter: any()=>{

// }


onMounted(() => {
    console.log(route.query.id,'获取地址栏项目id');
})
</script>

<style lang="less" scoped>
// p.active {
//   border-color: blue;
// }
// .prop{
//     color: #C0C0C0;
// }
.center{
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #BAE2FF;
    padding-left: 15px;
}
// .box{
//     width: 100%;
//     height: 80px;
//     margin-top: 10px;
// }
// .box span{
//     border: 1px solid #ccc;
//     margin-right: 15px;
//     padding: 10px;
//     margin-top: 20px;
//     font-weight: 600;
// }
button{
    width: 100px;
    height: 30px;
    color: #fff;
    left: 80%;
    background-color: #607BD2;
    border: none;
}
</style>>
