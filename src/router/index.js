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

// ????????????????????????
router.beforeEach((to, from, next) => {
  // to ???????????????????????????
  // form ?????????????????????????????????
  // next ??????????????????????????????
  // next() ?????? next('/login') ????????????

  // ???????????????????????????????????????(?????????????????????)???????????????
  if (to.path === '/login') return next();
  // ??????token
  const tokenStr = window.sessionStorage.getItem('token');
  // ????????????token???????????????????????????
  if (!tokenStr) return next('/login');
  // ????????????token?????????
  next();
})

export default router
