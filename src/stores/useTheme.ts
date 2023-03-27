import { ref } from "vue";
import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", () => {
  const themeValue = ref('dark');
  const setTheme = (val: string) => {
    themeValue.value = val
  };

  return { themeValue, setTheme };
});
