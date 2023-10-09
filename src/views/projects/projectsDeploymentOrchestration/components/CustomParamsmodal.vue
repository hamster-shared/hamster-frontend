<template>
  <div>
    <a-modal :footer="null" width="760px" centered="true" v-model:visible="importVisible">
      <div class="text-[24px] text-[#151210] font-bold">Custom Params</div>
      <template #closeIcon>
        <img class="mt-5" src="@/assets/icons/closeIcon.svg" />
      </template>
      <div>
        <a-form class="modal-form" :model="formData" ref="formRef" :rules="formRules" layout="vertical">
          <a-form-item name="Contract A.init">
            <div class="text-[18px] text-[#151210] font-bold mt-[32px] mb-[20px]">Contract A.init</div>
            <a-input-group>
              <a-row :gutter="8" v-for="item in formData.secretArr" class="mt-[5px]">
                <a-col :span="11">
                  <a-input class="modal-input" v-model:value="item.secretName" allow-clear autocomplete="off" />
                </a-col>
                <a-col :span="11">
                  <a-input class="modal-input" v-model:value="item.secretValue" allow-clear autocomplete="off" />
                </a-col>
                <a-col :span="2" class="cursor-pointer">
                  <label class="text-[18px] text-[#E2B578] leading-[42px]" @click="deleteSecret(item)">Delete</label>
                </a-col>
              </a-row>
            </a-input-group>
          </a-form-item>
          <div class="text-center">
            <a-button class="add-btn" @click="addSecret">Add Param</a-button>
            <a-button class="done-btn" @click="doneSecret">Done</a-button>
          </div>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";

const importVisible = ref<boolean>(true);

const formData = reactive<any>({
  secretArr: [
    {
      secretName: '',
      secretValue: '',
    }
  ],
});

const formRules = computed(() => {
  const requiredRule = (message: string) => ({ required: true, trigger: 'change', message });
  return {
    subscription: [requiredRule('Subscription')],
    consumers: [requiredRule('Consumers')],
  };
});


const deleteSecret = (item: any) => {
  if (formData.secretArr.length > 0) {
    console.log('~~~~~', item, formData.secretArr)
    formData.secretArr = formData.secretArr.filter((i: any) => {
      if (i.secretName == item.secretName) {

      } else {
        return item
      }
    })
    if (formData.secretArr.length == 0) {
      formData.secretArr.push({
        secretName: '',
        secretValue: '',
      })
    }
    console.log('aaaaa', formData.secretArr)
  }
}

const addSecret = (item: any) => {
  formData.secretArr.push({
    secretName: '',
    secretValue: '',
  })
}

const doneSecret = () => {
  console.log('完成参数设置,调接口吧')
}


</script>

<style lang="less" scoped>
.ant-btn {
  width: 24%;
  height: 43px;
}

.add-btn {
  background-color: #ffffff;
  color: #E2B578;
  margin-right: 20px;
}
</style>