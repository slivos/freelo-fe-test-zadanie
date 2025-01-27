import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import FloatingVue from "floating-vue";
import withUUID from "vue-uuid";

import "floating-vue/dist/style.css";
import "./style.css";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(FloatingVue);
app.use(withUUID);
app.mount("#app");
