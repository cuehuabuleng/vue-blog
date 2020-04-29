import Vue from 'vue'
import App from './App.vue'
import router from '../src/router/index.js'
import store from './store';
import echarts from 'echarts'
import './assets/styles/reset.css'
import './assets/styles/iconfont.css'
import { Message, MessageBox, Tag, Button,Input, Select, Option, Checkbox, CheckboxGroup} from "element-ui";
Vue.prototype.$message = Message;
Vue.use(Tag);
Vue.use(Button);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Checkbox),
Vue.use(CheckboxGroup)
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import promise from 'es6-promise';
promise.polyfill();
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
