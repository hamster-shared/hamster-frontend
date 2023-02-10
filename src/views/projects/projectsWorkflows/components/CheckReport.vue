<template>
  <div class=" dark:text-white text-[#121211]">
    <div class="dark:bg-[#1D1C1A] bg-[#ffffff] dark:text-white text-[#121211] mt-[24px] p-[32px] rounded-[12px]"
      v-for="item in checkReportData" :key="item.id">
      <img class="align-middle mr-[8px]" :src="getImageUrl(item.checkTool)" />
      <span class="text-[24px] font-bold align-middle">{{ item.name }}</span>
      <a-collapse v-model:activeKey="activeKey" accordion v-for="val in item.reportFileData" :key="val.Name">
        <a-collapse-panel :key="val.name + item.id" :header="val.name" :showArrow="false">
          
          <a-table :class="theme.themeValue === 'dark' ? 'dark-table-css' : ''" class="noHeader-table-css"
            v-if="projectType === '2' && item.checkTool === 'ESLint' && val.message"
            :dataSource="val.message" :columns="ESLintColumns" :pagination="false" :showHeader="false">
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.dataIndex === 'columnLine'">
                line {{ record.line }},col {{ record.column }},
              </template>
            </template>
          </a-table>

          <a-table :class="theme.themeValue === 'dark' ? 'dark-table-css' : ''" class="noHeader-table-css"
            v-if="projectType === '1' && (item.checkTool === 'mythril' || item.checkTool === 'ESLint') && val.message"
            :dataSource="val.message" :columns="SolhintColumns" :pagination="false" :showHeader="false">
          </a-table>

          <a-table :class="theme.themeValue === 'dark' ? 'dark-table-css' : ''" class="noHeader-table-css"
            v-if="item.checkTool === 'Solhint' && val.message" :dataSource="val.message" :columns="SolhintColumns"
            :pagination="false" :showHeader="false">
          </a-table>

          <a-table :class="theme.themeValue === 'dark' ? 'dark-table-css' : ''" class="table-css"
            v-if="item.checkTool === 'sol-profiler' && val.message" :dataSource="val.message" :columns="columns"
            :pagination="false">
          </a-table>

          <div v-if="!val.message" class="text-center">
            <img src="@/assets/images/report-b.png" class="w-[128px] hidden dark:inline-block" />
            <img src="@/assets/images/report-w.png" class="w-[128px] dark:hidden" />
            <div class="dark:text-white text-[#151210] text-[24px] font-bold">Congratulations！</div>
            <div class="text-[#73706E]">No issues were detected.</div>
          </div>
          <div class="text-[#73706E]">{{ 'Support by '+ item.checkTool }}</div>

          <template #extra>
            <div>
              <span class="mr-[8px]" v-show="item.checkTool !== 'sol-profiler'">
                {{ val.issue + ' issues' }}
              </span>
              <img class="up-tran w-[12px] hidden dark:inline-block" src="@/assets/icons/up-b.svg" />
              <img class="up-tran w-[12px] dark:hidden" src="@/assets/icons/up.svg" />
            </div>
          </template>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { toRefs } from 'vue';
import { useThemeStore } from "@/stores/useTheme";
const theme = useThemeStore();

const activeKey = ref(['1']);
const props = defineProps({
  projectType: String,
  checkReportData: Array,
})

const getImageUrl = (iconName: string) => {
  return new URL(`../../../../assets/icons/${iconName}.svg`, import.meta.url)
    .href;
}

const customRender = ({ text }) => {
  if (!text) {
    return '-'
  } else {
    return text
  }
}

const SolhintColumns = [
  {
    title: 'column',
    dataIndex: 'column',
    align: "center",
    key: 'column',
  },
  {
    title: 'level',
    dataIndex: 'level',
    align: "center",
    key: 'level',
  },
  {
    title: 'line',
    dataIndex: 'line',
    align: "center",
    key: 'line',
  },
  {
    title: 'note',
    dataIndex: 'note',
    align: "center",
    key: 'note',
  },
  {
    title: 'originalText',
    dataIndex: 'originalText',
    align: "center",
    key: 'originalText',
  },
  {
    title: 'tool',
    dataIndex: 'tool',
    align: "center",
    key: 'tool',
  },
]

const ESLintColumns = [
  {
    title: 'column',
    dataIndex: 'columnLine',
    align: "left",
    key: 'column',
  },
  {
    title: 'note',
    dataIndex: 'note',
    align: "center",
    key: 'note',
  },
  {
    title: 'tool',
    dataIndex: 'tool',
    align: "right",
    key: 'tool',
  },
]

const columns = [
  {
    title: 'Contract',
    dataIndex: 'contract',
    customRender,
    align: "center",
    key: 'contract',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    customRender,
    align: "center",
    key: 'category',
  },
  {
    title: 'Function()',
    dataIndex: 'function',
    customRender,
    align: "center",
    key: 'function',
  },
  {
    title: 'Visibility',
    dataIndex: 'visibility',
    customRender,
    align: "center",
    key: 'visibility',
  },
  {
    title: 'View/Pure',
    dataIndex: 'viewPure',
    customRender,
    align: "center",
    key: 'viewPure',
  },
  {
    title: 'Returns',
    dataIndex: 'returns',
    customRender,
    align: "center",
    key: 'returns',
  },
  {
    title: 'Modifiers',
    dataIndex: 'modifiers',
    customRender,
    align: "center",
    key: 'modifiers',
  }
];

const { checkReportData, projectType } = toRefs(props)

</script>

<style lang="less" scoped>
@backGroundCOlor: #1D1C1A;

.checkReport {
  font-size: 16px;
  transition: all .3s, visibility 0s;
}

.up-tran {
  transform: rotate(180deg);
  transition: all .3s, visibility 0s;
}

:deep(.ant-collapse-item-active .up-tran) {
  transform: rotate(0deg);
}


:deep(.dark-table-css .ant-table) {
  border: 1px solid #434343;
}

:deep(.ant-table) {
  border: 1px solid #EBEBEB;
}

:deep(.dark-table-css.table-css .ant-table-thead>tr>th) {
  background-color: #36322D;
  color: #FFFFFF;
  border-color: transparent;
}

:deep(.table-css .ant-table-thead>tr>th) {
  background-color: #F6F6F6;
  color: #151210;
  border-color: transparent;
}

:deep(.dark-table-css.table-css .ant-table-tbody) {
  background-color: #1D1C1A;
}

:deep(.table-css .ant-table-tbody) {
  background-color: #ffffff;
}

:deep(.dark-table-css.noHeader-table-css .ant-table-tbody) {
  background-color: #1D1C1A;
}

:deep(.noHeader-table-css .ant-table-tbody) {
  background-color: #ffffff;
}

:deep(.noHeader-table-css .ant-table-row:first-child .ant-table-cell:first-child) {
  border-radius: 12px 0 0 0;
}

:deep(.noHeader-table-css .ant-table-row:first-child .ant-table-cell:last-child) {
  border-radius: 0 12px 0 0;
}

:deep(.ant-table-row:last-child .ant-table-cell:first-child) {
  border-radius: 0 0 0 12px;
}

:deep(.ant-table-row:last-child .ant-table-cell:last-child) {
  border-radius: 0 0 12px 0;
}
</style>