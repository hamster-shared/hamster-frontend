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
          <a-form-item name="Type" label="Type">
            <a-input class="modal-input" v-model:value="formData.canisterId" placeholder="Please enter Canister Name" allow-clear autocomplete="off" />
          </a-form-item>
          <a-form-item name="file" label="Upload file">

            <label for="uploadFile" @change="uploadFileList">
            <input type="file" id="uploadFile" hidden />

              <div class="ant-upload-text" v-if="fileUrl == null">
                <plus-outlined />
                <span>Please drag and drop files here to upload</span>
              </div>
              <div class="ant-upload-text" v-if="fileUrl != null">
                  {{fileUrl}}
              </div>
            </label>
<!--            <a-upload-->
<!--                :before-upload="handleBeforeUpload"-->
<!--                :on-success="handleUploadSuccess"-->
<!--                :on-error="handleUploadError"-->
<!--                :show-upload-list="false"-->
<!--            >-->
<!--             <div>{{}}</div>-->
<!--              <div >-->
<!--&lt;!&ndash;                <loading-outlined v-if="loading"></loading-outlined>&ndash;&gt;-->

<!--                <div class="ant-upload-text">-->
<!--                  <plus-outlined />-->
<!--                  <span>Please drag and drop files here to upload</span>-->
<!--                </div>-->
<!--              </div>-->
<!--            </a-upload>-->

          </a-form-item>
          <a-form-item name="mode" label="Install mode">
            <a-select @change="onChange">
<!--              <a-select-option v-for="network in ecosystemDetailInfo.networkDetailInfoList" :key="network.code" :value="network.code">{{network.code}}</a-select-option> -->
              <a-select-option value="">Upgrade</a-select-option>
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

const props = defineProps({
  visible:{
    type:Boolean,
    default:false
  },
  canisterId:{
    type:String,
    default:''
  },
  cycles:{
    type:String,
    default:''
  }
});
const route = useRoute()
const id = route.params.id
const { visible, canisterId, cycles } = toRefs(props)
const emit = defineEmits(["handleCancel", 'showBuyCycles', 'showBuyCycleMsg', 'refreshCanister'])
const formRef = ref();
const formData = reactive({
  canisterId: '',
  amount: 0.1,
});
const walletCanisterId = ref()
const walletCyclesBalance = ref()
const topLoading = ref(false)
const fileUrl = ref(null);



const formRules = computed(() => {

  const requiredRule = (message) => ({ required: true, trigger: 'change', message });

  return {
    amount: [requiredRule('Please enter Amount')],
  };
});

const handleTopUp = async() => {
  console.log('handleTopUp',formData)
  try {
    topLoading.value = true
    const params = {
      canisterId: formData.canisterId,
      amount: formData.amount + ''
    }
    const res = await apiRechargeCanister(id,params)
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
  console.log(files)
}

const getWalletInfo = async()=>{
  const res = await apiWalletInfo(id)
  walletCanisterId.value = res.data.canisterId
  walletCyclesBalance.value = res.data.cyclesBalance
}

onMounted(async()=>{
  formData.canisterId = canisterId.value
  // formData.amount = cycles.value
  await getWalletInfo()
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

</style>
