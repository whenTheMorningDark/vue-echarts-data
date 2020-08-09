import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
import vdr from "vue-draggable-resizable-gorkys";
import contentmenu from "v-contextmenu";
import "v-contextmenu/dist/index.css";
import store from "./store";

Vue.use(contentmenu);
Vue.component("vdr", vdr);
Vue.use(Element);
new Vue({
  render: h => h(App),
  store
}).$mount('#app')