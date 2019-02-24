import Vue from 'vue'
import root from './root.vue'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.prototype.$http = axios
/* eslint-disable no-new */
Vue.use(ElementUI)
new Vue({
  el: '#root',
  render: h => h(root)
})
