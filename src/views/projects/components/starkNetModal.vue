<template>
  <a-modal v-model:visible="starknetVisible" :title="hashTitle" :footer="null" @cancel="cancelModal" width="760px">
    <template #closeIcon>
      <img class="" src="@/assets/icons/closeIcon.svg" />
    </template>
    <div class="mb-[32px] text-[#73706E]">
      The contract deployment transaction takes several minutes, please wait patiently.
      <br />
      you can query the status in StackNet through the following transaction hash.
    </div>
    <a-form ref="modalFormRef" class="modalFormRef col-span-3 mb-[16px]" :model="starknetForm" name="userForm"
      :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" autocomplete="off" noStyle>
      <a-form-item>
        <div class="text-[#151210] mb-[12px]">Transaction Hash</div>
        <a-input v-model:value="hash" :placeholder="'Getting now，please wait a moment...'" disabled>
          <template #suffix>
            <span class="text-[#E2B578] font-bold cursor-pointer" @click="queryDeploy">Query</span>
          </template>
        </a-input>
      </a-form-item>
    </a-form>
    <div class="text-[#73706E]">Tips: If you close this dialog box, you can also query the deployment status on project
      page.</div>
    <div class="text-center mt-[32px]">
      <a-button @click="backProjects">Back to project list</a-button>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  starknetVisible: { type: Boolean, default: false },
  hasDeclareHash: { type: Boolean, default: false },
  projectsId: {
    type: String,
    default: ''
  },
});

const router = useRouter();
const hashTitle = ref('');
const starknetHashData = reactive(JSON.parse(localStorage.getItem('starknetHashData'))) || reactive({});

// console.log('starknetHashData', starknetHashData[props.projectsId])
const hash = ref('');

const declareHash = starknetHashData[props.projectsId]?.declareHash;
const deployHash = starknetHashData[props.projectsId]?.deployHash;
hashTitle.value = deployHash ? 'Deploying' : 'Declareing';
hash.value = deployHash ? deployHash : declareHash;

const { starknetVisible } = toRefs(props);

const backProjects = () => {
  cancelModal();
  router.push('/projects');
}

const queryDeploy = () => {
  window.open(`https://testnet.starkscan.co/tx/${hash.value}`)
}

const emits = defineEmits(['cancelModal'])

const cancelModal = () => {
  emits("cancelModal", false);
}

watch(() => props.hasDeclareHash,
  (val) => {
    if (val) {
      const hashData = reactive(JSON.parse(localStorage.getItem('starknetHashData'))) || {};
      hash.value = hashData[props.projectsId]?.declareHash;
    }
  }, { deep: true, immediate: false })

</script>
<style lang="less" scoped>
.ant-btn {
  width: 180px;
  height: 43px;
}

:deep(.ant-form-item) {
  margin-bottom: 12px;
}

:deep(.ant-input) {
  color: #151210 !important;
  font-weight: 700;
}
</style>