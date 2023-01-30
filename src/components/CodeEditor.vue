<template>
  <div
    ref="editContainer"
    class="code-editor"
  />
</template>
<script>
import { getCurrentInstance, onMounted, watch } from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
self.MonacoEnvironment = {
  getWorker() {
    return new JsonWorker();
  },
};
export default {
  name: "CodeEditor",
  props: {
    value: String,
    readOnly: String,
  },
  setup(props, { emit }) {
    let monacoEditor = null;
    const { proxy } = getCurrentInstance();

    watch(
      () => props.value,
      (value) => {
        // Prevent cursor redirection when changing editor content
        if (value !== monacoEditor?.getValue()) {
          monacoEditor.setValue(value);
        }
      }
    );

    onMounted(() => {
      monaco.editor.defineTheme("custom", {
        base: "vs",
        inherit: true,
        rules: [{ background: "#F7F8F9" }],
        colors: {
          // Related color attribute configuration
          // 'editor.foreground': '#000000',
          "editor.background": "#272A34", //背景色
          // 'editorCursor.foreground': '#8B0000',
          'editor.lineHighlightBackground': '#272A34', //选中行背景颜色
          // 'editorLineNumber.foreground': '#008800',
          'editor.selectionBackground': '#e6f7ff', //选中文字背景颜色
          // 'editor.inactiveSelectionBackground': '#88000015'
        },
      });
      //Set custom theme
      monaco.editor.setTheme("custom");
      monacoEditor = monaco.editor.create(proxy.$refs.editContainer, {
        value: props.value,
        readOnly: props.readOnly,
        language: "yaml",
        theme: "custom",
        automaticLayout: true,
        selectOnLineNumbers: false,
        minimap: {
          enabled: false,
        },
        fontSize: 16,
        scrollBeyondLastLine: false,
        overviewRulerBorder: false,
        fixedOverflowWidgets: false,
        scrollbar: {
          alwaysConsumeMouseWheel: false,
        },
      });
      // Monitoring value change
      monacoEditor.onDidChangeModelContent(() => {
        const currenValue = monacoEditor?.getValue();
        emit("update:value", currenValue);
        emit("getYamlValue", currenValue);
      })
    });
    return {};
  },
};
</script>
<style scoped lang="less">
.code-editor {
  width: 100%;
  height: 100%;
}

:deep(.monaco-editor),
:deep(.overflow-guard) {
  border-radius: 14px;
}
// :deep(.monaco-editor .margin),:deep(.monaco-scrollable-element){
//   padding-top: 10px;
// }
:deep(.monaco-editor .line-numbers.active-line-number){
  color: #E2B578;
}
:deep(.monaco-editor .line-numbers){
  color: #BBBAB9;
}
:deep(.mtk5){
  color: #E2B578;
}
:deep(.mtk22){
  color: #6A9955;
}
</style>
