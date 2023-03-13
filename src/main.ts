import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import i18n from "./lang/index";
import tool from './utils/tool.js'

import App from "./App.vue";
import router from "./router";
import "./design/main.css";
// import "ant-design-vue/dist/antd.css";
import 'ant-design-vue/dist/antd.variable.min.css';
import "./design/app.less";

// console.log('env', import.meta.env)
// console.log('VITE_BASE_API', import.meta.env.VITE_BASE_API)

import DefaultLayout from "./layout/default/index.vue";
import Null from "./layout/null/index.vue";
import SvgIcon from "./components/Icon/SvgIcon.vue";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Antd);
app.use(i18n);
app.use(tool);

app.component("layout-default", DefaultLayout);
app.component("layout-null", Null);
app.component("svg-icon", SvgIcon);
app.mount("#app");
