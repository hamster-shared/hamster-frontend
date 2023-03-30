<template>
  <div class="flex" :class="theme.themeValue === 'dark' ? 'dark-css' : ''">
    <a-radio-group v-model:value="radioValue" class="radio-class">
      <a-radio-button value="mainNet">MainNet</a-radio-button>
      <a-radio-button value="testNet">TestNet</a-radio-button>
    </a-radio-group>

    <div>chart</div>
    
    <a-divider type="vertical" class="verticle-divider"/>
    
    <div class="w-60">
      <span class="block mb-4 text-lg">My Subscripion</span>
      <div v-for="item in subscripion">
        <div class="flex items-center justify-between text-sm">
          <span>{{ item.title }}</span>
          <span>{{ item.number }}</span>
          <a-button type="link">{{ item.btnTitle }}</a-button>
        </div>
        <a-divider class="subscripion-divider"/>
      </div>
      <a-button type="link">view more</a-button>
    </div>
  </div>
  
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useThemeStore } from "@/stores/useTheme";

  const theme = useThemeStore();

  const radioValue = ref('mainNet')
  const subscripion = reactive([
    { title: 'Subscripion', number: '3', btnTitle: 'Create' },
    { title: 'Consumers', number: '-', btnTitle: 'Add' },
    { title: 'Funds', number: '11.23link', btnTitle: 'Add' },
  ])
</script>

<style scoped lang="less">
  :deep(.radio-class,.ant-radio-group) {
     .ant-radio-button-wrapper {
      background-color: unset;
      border-color: unset;
      color: grey;
      border-radius: unset;
    }
    .ant-radio-button-wrapper-checked:not([class*=" ant-radio-button-wrapper-disabled"]).ant-radio-button-wrapper:first-child,
    .ant-radio-button-wrapper-checked:not([class*=" ant-radio-button-wrapper-disabled"]).ant-radio-button-wrapper:nth-child(2){
      color: #E2B578;
    }
  }
  .verticle-divider {
    height: 230px;
    margin: 0 24px;
  }
  .subscripion-divider {
    margin: 8px auto;
  }
</style>