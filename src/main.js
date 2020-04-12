import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import axios from 'axios'
import './fonts/iconfont.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//富文本进行全局挂载
Vue.use(VueQuillEditor)
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//在request拦截器中，展示进度条NProgress.start();
axios.interceptors.request.use(config=>{
  // console.log(config)
  NProgress.start()
  //在config中一个headers，我们需要为header添加一个属性Authorization来挂载我们的token，
  config.headers.Authorization=window.sessionStorage.getItem('token')
  
  //必须要return，相当与于把请求给发送出去，否则会报错
  return config
})
//在response拦截器中，隐藏进度条NProgress.done();
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config

}
  
)
Vue.prototype.$http=axios
Vue.config.productionTip = false
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)
//定义全局过滤器
Vue.filter('dateFormat',function(originVal){
  const dt=new Date(originVal)
  const y=dt.getFullYear()
  const m=(dt.getMonth()+1+'').padStart(2,'0')
  const d=(dt.getDate()+'').padStart(2,'0')
  const hh=(dt.getHours()+'').padStart(2,'0')
  const mm=(dt.getMinutes()+'').padStart(2,'0')
  const ss=(dt.getSeconds()+'').padStart(2,'0')
return (`${y}-${m}-${d} ${hh}-${mm}-${ss}`)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
