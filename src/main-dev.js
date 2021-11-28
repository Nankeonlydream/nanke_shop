import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入全局样式表
import './assets/css/global.css'

// 引入阿里图标样式
import './assets/iconfont/iconfont.css'

// 引入animated动画
import animated from 'animate.css'
Vue.use(animated)

/*element相关*/
import './plugins/element.js'
// element自定义样式
import './assets/css/element-variables.scss'
import TreeTable from 'vue-table-with-tree-grid'

// 导入VueQuillEditor可视化编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 注册富文本编辑器
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

// 导入NProgress包对应的JS和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入axios
import axios from "axios";
// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// 在request拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
// 在response拦截器中，隐藏进度条 NProgress.done
axios.interceptors.response.use(config => {
  NProgress.done();
  return config
})

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');

  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})

Vue.component('tree-table', TreeTable);

Vue.config.ignoredElements = ['ion-icon'];

Vue.prototype.$http = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
