// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import store from './store/store'
// 导入全局样式
import "assets/css/global.css"
import "assets/icon/iconfont.css"
// 引入echart
import Echart from 'vue-echarts'
import 'echarts/lib/chart/line'
import JsonSchemaEditor from 'json-schema-editor-vue'

Vue.use(JsonSchemaEditor)

Vue.config.productionTip = false
Vue.use(ElementUI,{ size: 'medium' });
Vue.component('v-chart', Echart)

import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render:function(h){
    return h(App)
  }
}).$mount('#app')
