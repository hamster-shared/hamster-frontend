<template>
  <div class="mb-[30px]">
    <div class="text-[24px] font-bold">Invoke Contract Method</div>
    <div class="text-[16px] text-[#73706E] dark:text-[#E0DBD2]">Automatically call contract methods post-deployment, including its
      own init method or other contracts' methods
    </div>
    <div v-if="selectedName && showMethod" 
      v-for="(methodItem, methodKey) in methodList" :key="methodKey"
      class="mt-[20px] border border-solid border-[#D2D2D2] dark:border-[#6C6C6C] bg-[#FCFCFC] dark:bg-[#191816] rounded-[12px] p-[20px]">
      <div class="flex justify-between mb-[20px]">
        <div class="text-[21px] font-bold">Contract Method</div>
        <div>
          <a-popover trigger="hover" placement="left">
            <template #content>
              <div class=" cursor-pointer mb-[8px] hover:text-[#E2B578]" @click="deleteBtn(methodKey)">Delete</div>
              <div class=" cursor-pointer mb-[8px] hover:text-[#E2B578]" @click="addCustomParamsBtn(methodKey)">Add Custom Params
              </div>
            </template>
            <img class="w-[4px] cursor-pointer" src="@/assets/images/diandian.png" />
          </a-popover>
        </div>
      </div>
      <a-form ref="formInvokeRef" :rules="formRules" :model="methodItem.formData" layout="vertical">
        <div class="grid grid-cols-2 gap-4">
          <a-form-item name="methodName" label="Method Name1111" :rules="[{ required: true }]">
            <a-select v-model:value="methodItem.formData.methodName" @select="changeMethodName($event, methodKey)" 
              placeholder="Contract Address" :options="contractOrchestration.map((item: any) => ({ value: item.name, label:item.name.indexOf('(')!='-1' ? item.name?.slice(0,item.name.indexOf('(')):item.name }))">
            </a-select>
          </a-form-item>
          <a-form-item class="form-noLabel" name="methodType" :rules="[{ required: true }]">
            <a-select v-model:value="methodItem.formData.methodType" @change="changeMethodType($event, methodKey)"
              placeholder="Contract method Type" :options="methodMap.get(methodItem.formData.methodName).functionData.map((item: any) => ({ value: item }))">
            </a-select>
          </a-form-item>  
        </div>
        <div v-if="methodItem.formData.methodType" 
            v-for="(item, key) in methodMap.get(methodItem.formData.methodName).inputData[methodItem.formData.methodType]" :key="key">
          <div class="grid grid-cols-2 gap-4" v-if="item.type == 'address'">
            <a-form-item :label="item.name" :name="item.name + 'param'" :rules="[{ required: true }]" >
              <a-select v-model:value="methodItem.formData[item.name + 'param']"  @change="checkFiledChange"
                placeholder="Select project contract" :options="paramList">
              </a-select>
            </a-form-item>
            <a-form-item class="form-noLabel" :name="item.name" :rules="[{ required: true }]">
              <label class="text-[#73706E] dark:text-[#C0BCB4] absolute -top-[30px] right-0">Address</label>
              <a-select @change="checkFiledChange" v-if="methodItem.formData[item.name + 'param'] == 1" v-model:value="methodItem.formData[item.name]"  
                placeholder="Contract Address" :options="contractOrchestration.map((opItem: any) => ({ value: opItem.name, label:opItem.name.indexOf('(')!='-1' ? opItem.name?.slice(0,opItem.name.indexOf('(')):opItem.name }))">
              </a-select>
              <a-input @change="checkFiledChange" v-else v-model:value="methodItem.formData[item.name]" :placeholder="'Please input ' + item.type" autoComplete="off" allowClear />
            </a-form-item>  
          </div>
          <a-form-item v-else :label="item.name" :name="item.name" :rules="[{ required: true }]">
            <a-input @change="checkFiledChange" v-model:value="methodItem.formData[item.name]" :placeholder="'Please input ' + item.type" autoComplete="off" allowClear />
          </a-form-item>
        </div>
        <a-form-item v-if="methodItem.formData.customParams" label="Custom Params" name="customParams" :rules="[{ required: true }]">
          <span class="custom-edit" @click="editCustom(methodItem.formData.customParams, methodKey)">Edit</span>
          <a-textarea disabled="true" v-model:value="methodItem.formData.customParams" :rows="4" placeholder="please inter a value" />
        </a-form-item>
        <CustomParamsmodal :methodName="methodItem.formData.methodName" :methodType="methodItem.formData.methodType" :visible="methodItem.formData.visible" :methodKey="methodKey" @showContract="methodItem.formData.visible = false" @doneSecret="doneSecret" />
      </a-form>
    </div>
    <div @click="moreContractMethod" 
      class="cursor-pointer flex justify-center items-center mt-[30px] h-[60px] leading-[60px] text-[16px] text-[#666666] dark:text-[#C3C4C7] text-center border border-dashed rounded-[12px] border-[#D2D2D2] dark:border-[#6C6C6C] bg-[#FCFCFC] dark:bg-[#191816]">
      <img src="@/assets/images/add.png" class="h-[32px] mr-[20px]" />
      <label class="cursor-pointer">Add More Contract Methods</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, toRefs, onMounted } from "vue";
import { useRoute } from "vue-router";
import CustomParamsmodal from "./CustomParamsmodal.vue";
import { apiGetAbiInfobyId } from '@/apis/contractOrchestrationDeploy'

const route:any = useRoute()

const props = defineProps({
  selectedName: String,
  methodMap:{
    type: Map as any,
    required: true,
  },
  contractOrchestration:{
    type:Array as any,
    default:()=>[]
  }
});

const { selectedName, methodMap, contractOrchestration } = toRefs(props);
console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',methodMap.value)
const emits = defineEmits(['setAbiInfo', 'setDisabledSave']);

const visible = ref(false);
const showMethod = ref(false);
// const formInvokeRef = ref<FormInstance>();
const formInvokeRef = ref();
const formDataDemo = reactive<any>({
  methodName: selectedName?.value,
  methodType: '',
  customParams: '', //不默认添加
}); 
const methodList = ref<any>([]); 

const isChange = ref(false);
const paramList = ref([
  {label: 'Select project contract', value: 1},
  {label: 'Manual input', value: 2},
])


const formRules = computed(() => {
  // const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
  // return {
  //   methodType1: [requiredRule('')],
  //   // param2: [requiredRule('')],
  //   // param3: [requiredRule('')],
  // };
});

const checkFiledChange = () => {
  isChange.value = true;
}

const moreContractMethod = () => {
  if (selectedName?.value) {
    checkFiledChange();
    let formDemo = Object.assign({}, formDataDemo);
    methodList.value.push({formData:formDemo});
    methodList.value[methodList.value.length-1].formData.methodName = selectedName?.value
    if (!showMethod.value) {
      showMethod.value = true;
    }
    emits('setDisabledSave', false);
  }
}
//选择合同
const changeMethodName = async(val: any, methodKey: number) => {
  // console.log(1111111111111111,val,contractOrchestration.value)
  // let a = contractOrchestration.value.filter((item:any)=>{
  //   return item.name==val;
  // })
  // console.log(a[0].id,'选择合同:')
  checkFiledChange();
  methodList.value[methodKey].formData.methodType = '';
  methodList.value[methodKey].formData.address = '';
  methodList.value[methodKey].formData.customParams = '';
  console.log(222222222222,contractOrchestration.value)
  if (!methodMap.value.get(val)) {
    const res = await apiGetAbiInfobyId(route.query.id,'','')
    contractOrchestration.value.forEach((element: any) => {
      if (element.name === val) {
        console.log(1231123123123,element.abiInfo)
        emits('setAbiInfo', element.abiInfo, val, 'method');
      }
    });
  }
}
//选择function类型
const changeMethodType = (val: any, methodKey: number) => {
  checkFiledChange();
  methodList.value[methodKey].formData = Object.assign({}, methodList.value[methodKey].formData, methodMap.value.get(methodList.value[methodKey].formData.methodName).formList[val]);
  console.log("methodList:::",methodList.value);
}

const deleteBtn = (methodKey: number) => {
  checkFiledChange();
  methodList.value.splice(methodKey, 1)
}
const addCustomParamsBtn = (methodKey:number) => {
  methodList.value[methodKey].formData.visible = true;
  console.log('add',methodList.value[methodKey].formData.visible,methodKey)
}
const doneSecret = (methodKey:number, val:any) => {
  checkFiledChange();
  let str = '';
  val.forEach((e: any) => {
    str += `${e.secretName}: ${e.secretValue}\n`
  });
  console.log(methodKey,1111111111111,methodList.value)
  methodList.value[methodKey].formData.visible = false;
  methodList.value[methodKey].formData.customParams = str;
  console.log('有值了：' + val)
}
const editCustom = (val: string, methodKey: number) => {
  methodList.value[methodKey].formData.customParams = val
  methodList.value[methodKey].formData.visible = true;
}

onMounted(() => {
  console.log("methodList:",methodList.value.length,methodList.value);
  methodList.value = methodList.value.map((item:any)=>{
    item.visible = false
    return item
  })
});

defineExpose({
  methodList,
  showMethod,
  formInvokeRef,
  isChange,
})

</script>

<style scoped lang="less">
#components-popover-demo-placement .ant-btn {
  width: 70px;
  text-align: center;
  padding: 0;
  margin-right: 8px;
  margin-bottom: 8px;
}
.custom-edit {
  position: absolute;
  right: 0;
  top: -30px;
  font-size: 16px;
  color: #E2B578;
  cursor: pointer;
}
</style>