<template>
  <a-modal v-model:visible="visible" width="760px" :footer="null" @cancel="handleCancel">
    <template #closeIcon>
      <!-- <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/> -->
    </template>
    <div class="p-[8px]">
      <div class="flex justify-between items-center">
        <div class="w-[55%]">
          <div class="text-[24px] font-bold leading-[33px]">Install DApp</div>
        </div>
        <div>
          <img class="w-[24px] h-[24px]" src="@/assets/icons/closeIcon.svg" @click="handleCancel"/>
        </div>
      </div>
      <div class="mt-[30px]">
        <a-form class="modal-form" :model="formData" layout="vertical" ref="formRef" :rules="formRules">
          <a-form-item name="WasmType" label="WasmType" class="bgBox">
            <a-select @change="onChange"  v-model:value="formData.WasmType">
              <a-select-option value="contract">contract</a-select-option>
              <a-select-option value="frontend">frontend</a-select-option>
            </a-select>

          </a-form-item>
          <a-form-item name="file" label="Upload file">

            <label for="uploadFile" @change="uploadFileList">
            <input type="file" id="uploadFile" hidden />

              <div class="ant-upload-text" v-if="fileUrl == null">
                <plus-outlined />
                <span>Please drag and drop files here to upload</span>
              </div>

              <div class="ant-upload-text" v-if="fileUrl != null">
                <div>
                  <div>{{fileUrl}}</div>
                  <div class="loader" v-if="loading" />
                </div>


              </div>
            </label>


          </a-form-item>
          <a-form-item name="mode" label="Install mode" class="bgBox">
            <a-select @change="onChange"  v-model:value="formData.mode">
              <a-select-option :value="0">Install</a-select-option>
              <a-select-option :value="1">Upgrade</a-select-option>
              <a-select-option :value="2">Reinstall</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
      <div class="text-center mt-[32px]">
        <a-button :loading="topLoading" class="!w-[240px] !h-[43px] ml-[24px]" @click="handleTopUp">Install</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script setup >
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from "ant-design-vue";
import { computed, reactive, ref, toRefs, onMounted } from "vue";
import { useRoute } from "vue-router";
import { apiWalletInfo, apiRechargeCanister } from '@/apis/canister'
import {postInstall, uploadWasm} from "@/apis/icp";

const props = defineProps({
  visible:{
    type:Boolean,
    default:false
  },
  canisterId:{
    type:String,
    default:''
  },
});
const route = useRoute()
const id = route.params.id
const { visible, canisterId, cycles } = toRefs(props)
const emit = defineEmits(["handleCancel", 'showBuyCycles', 'showBuyCycleMsg', 'refreshCanister'])
const formRef = ref();
const formData = reactive({
  canisterId: canisterId.value,
  WasmType: 'contract',
  mode: 0,
});
const walletCanisterId = ref()
const walletCyclesBalance = ref()
const topLoading = ref(false)
const loading = ref(false)
const fileUrl = ref(null);



const formRules = computed(() => {

  // const requiredRule = (message) => ({ required: true, trigger: 'change', message });
  //
  // return {
  //   amount: [requiredRule('Please enter Amount')],
  // };
});

const handleTopUp = async() => {
  console.log('handleTopUp',formData)
  try {
    topLoading.value = true
    const params = {
      canisterId: formData.canisterId,
      WasmType: formData.WasmType,
      mode: formData.mode
    }
    const res = await postInstall(params)
    topLoading.value = false
    message.success(res.message)
    emit('handleCancel')
    emit('refreshCanister')
  } catch (error) {
    console.log('error:',error)
    if(error.response.data.message.indexOf('out of cycles')!=-1){
      emit('showBuyCycleMsg')
    }else{
      message.error(error.response.data.message)
    }
    topLoading.value = false
  }
}

const showBuyCycles = () => {
  emit('handleCancel')
  emit('showBuyCycles')
}

const handleCancel = ()=>{
  emit('handleCancel')
}
// 0: install 1: upgrade, 2: reinstall
const onChange = (newVal) => {

}

const uploadFileList = (e) =>{
  const { files } = e.target ;
  fileUrl.value = files[0].name

  handleUpload(files[0])
}

const handleUpload = async(file) =>{
  loading.value = true;
  try{

    const formData = new FormData();
    formData.append('file', file);

    let rt = await uploadWasm (formData,canisterId.value);
    console.log(rt)

  }catch (e) {
    console.error(e)
  }finally {
    loading.value = false;
  }
}

// const getWalletInfo = async()=>{
//   const res = await apiWalletInfo(id)
//   walletCanisterId.value = res.data.canisterId
//   walletCyclesBalance.value = res.data.cyclesBalance
// }

onMounted(async()=>{
  formData.canisterId = canisterId.value
  // formData.amount = cycles.value
  // await getWalletInfo()
})
</script>
<style scoped lang="less">
:deep(.ant-form-item-label > label){
  font-size: 14px;
  font-weight: 400;
}
:deep(.modal-input-suffix .ant-input-suffix){
  display: flex;
}
:deep(.modal-input-suffix .ant-input-suffix .anticon-close-circle){
  order: 2;
}
.ant-upload-text{
  width: 100%;
  height: 101px;
  background: #FBF9F5;
  border-radius: 8px;
  border: 1px dashed #D2D2D2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  color: #9D9D9D;
  line-height: 19px;
  span{
    margin-right: 16px;
  }
}
.uploader{
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* HTML: <div class="loader"></div> */
.loader {
  width: calc(80px / cos(45deg));
  height: 6px;
  background: repeating-linear-gradient(-45deg,#E2B578 0 15px,#E2B57800 0 20px) left/200% 100%;
  animation: l3 2s infinite linear;
  margin:10px auto 0;
}
@keyframes l3 {
  100% {background-position:right}
}

</style>
<style>
.bgBox .ant-select-selection-item{
  color: #000!important;

}
.bgBox .ant-select-single .ant-select-selector{
  border-color: #EBEBEB!important;
}
</style>
