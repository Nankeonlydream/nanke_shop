import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welome" */ '../components/Login/Login')
const Home = () => import(/* webpackChunkName: "login_home_welome" */ '../views/Home')
const WelCome = () => import(/* webpackChunkName: "login_home_welome" */ '../components/WelCome/WelCome')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/User/Users')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/Power/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/Power/Roles')

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params')

const List = () => import(/* webpackChunkName: "GoodsList_Add_Edit" */ '../components/goods/List')
const Add = () => import(/* webpackChunkName: "GoodsList_Add_Edit" */ '../components/goods/Add')
const Edit = () => import(/* webpackChunkName: "GoodsList_Add_Edit" */ '../components/goods/Edit')

const Order = () => import(/* webpackChunkName: "Edit_Order_Report" */ '../components/order/Order')
const Report = () => import(/* webpackChunkName: "Edit_Order_Report" */ '../components/report/Report')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: WelCome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/goods/edit',
        component: Edit
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示将要访问的路径
  // form 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行 next('/login') 强制跳转

  // 判断用户是否访问的是登录页(不需要登录权限)，直接放行
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  // 如果没有token，强制跳转到登录页
  if (!tokenStr) return next('/login');
  // 表示存在token，放行
  next();
})

export default router
