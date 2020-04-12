import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import login from '../components/Login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import cate from '../components/goods/good-cate.vue'
import params from '../components/goods/good-params.vue'
import orders from '../components/order/orders.vue'
import reports from '../components/report/report.vue'
import goods from '../components/goods/good-list.vue'
import addGoods from '../components/goods/addGoods.vue'


const routes = [
  {path:'/',
  redirect:'/login'

  },
  {
    path:'/login',
    name:'login',
    component:login
  },
  {
    path:'/home',
    name:'home',
    component:home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:welcome},
      {path:'/users',component:users},
      {path:'/rights',component:rights},
      {path:'/roles',component:roles},
      {path:'/categories',component:cate},
      {path:'/params',component:params},
      {path:'/orders',component:orders},
      {path:'/reports',component:reports},
      {path:'/goods',component:goods},
      {path:'/goods/add',component:addGoods},
     
    ],
    
  },
  
]

const router = new VueRouter({
  routes
})
//挂在路由导航对象
router.beforeEach((to,from,next)=>{
  if(to.path==='/login')return next()
  //获取token
  const tokenstr=window.sessionStorage.getItem("token")
  if(!tokenstr)return next('/login')
  next()
})

export default router
