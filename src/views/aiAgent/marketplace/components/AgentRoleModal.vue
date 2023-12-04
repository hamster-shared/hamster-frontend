<template>
  <a-modal :footer="null" width="964px" centered="true" v-model:visible="modalVisible">
    <div class="text-[24px] text-[#151210] font-bold">Please select the Agent role style</div>
    <template #closeIcon>
      <img class="mt-5" src="@/assets/icons/closeIcon.svg" @click="hideVisible" />
    </template>
    <div class="my-[32px] bg-box py-[10px]">
      <div class="h-[400px] overflow-y-auto px-[30px] py-[20px] mr-[5px]">
        <a-radio-group v-model:value="roleValue">
          <a-radio-button v-for="(item, key) in roleList" :key="key" :value="item.value">
            <div class="font-semibold leading-[20px]">{{ item.label }}</div>
            <div class="text-[12px] leading-[17px]">{{ item.desc }}</div>
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <!-- <div class="my-[50px]">
      <a-radio-group v-model:value="roleValue">
        <a-radio-button v-for="(item, key) in roleList" :key="key" :value="item.value">{{ item.label }}</a-radio-button>
      </a-radio-group>
    </div> -->
    <div class="text-center">
      <a-button type="primary" class="w-[240px] !h-[43px] mr-[24px]" ghost @click="handleOk">Skip</a-button>
      <a-button type="primary" class="w-[240px] !h-[43px]" @click="handleOk">Confirm</a-button>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  modalVisible: Boolean,
});
const { modalVisible } = toRefs(props);
const emits = defineEmits(['hiddenModal']);

const roleValue = ref('');
const roleList = ref([
  { label: 'Inspector', value: 'Inspector', desc:'A serious and organized worker' },
  { label: 'Guardian', value: 'Guardian', desc:'A responsible and compassionate person' },
  { label: 'Guide', value: 'Guide', desc:'An imaginative and insightful person' },
  { label: 'Expert', value: 'Expert', desc:'An independent thinker and calm analyst' },
  { label: 'Craftsman', value: 'Craftsman', desc:'A person who likes adventure and challenges' },
  { label: 'Artist', value: 'Artist', desc:'A creative and sensitive person' },
  { label: 'Mediator', value: 'Mediator', desc:'An idealist and thinker' },
  { label: 'Logician', value: 'Logician', desc:'A smart and organized person' },
  { label: 'Entrepreneur', value: 'Entrepreneur', desc:'A person who likes adventure and excitement' },
  { label: 'Performer', value: 'Performer', desc:'A passionate and optimistic person' },
  { label: 'Dreamer', value: 'Dreamer', desc:'A person full of passion and creativit' },
  { label: 'Inventor', value: 'Inventor', desc:'A creative and adventurous person' },
  { label: 'General Manager', value: 'General Manager', desc:'A person with strong organizational skills and go' },
  { label: 'Governor', value: 'Governor', desc:'A person with compassion and concern for others' },
  { label: 'Educator', value: 'Educator', desc:'A person with empathy and leadership skills' },
  { label: 'Commander', value: 'Commander', desc:'A person with decision-making and leadership skills' },
]);

const handleOk = async () => {
  router.push('/aiAgent/agent');
  hideVisible();
}
const hideVisible = () => {
  emits('hiddenModal');
}
</script>
<style scoped lang="less">
:deep(.ant-radio-group) {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

:deep(.ant-radio-group .ant-radio-button-wrapper) {
  height: 89px;
  background: #FFFFFF;
  border-radius: 10px;
  border: 1px solid #DCDCDC;
  color: #696D71;
  text-align: center;
  padding: 20px;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)) {
  border-color: #E2B578;
  color: #000000;
}

:deep(.ant-radio-button-wrapper:not(:first-child):before) {
  display: none;
}
:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within){
  box-shadow: none;
}
.bg-box{
  background: #F4F4F4;
  box-shadow: 0px 0px 2px 0px rgba(210,210,210,0.5);
  border-radius: 10px;
}
</style>