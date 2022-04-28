// 配置路由信息

import VueRouter from 'vue-router'
import Vue from 'vue'
//路由懒加载
const Home = () => import('pages/home/Overview')
const Login = () => import('pages/login/Login')
const User = () => import('pages/user/User')
const Project = () => import('pages/project/Project')
const Interface = () => import('pages/interface/Interface')
const Testcase = () => import('pages/testcase/Testcase')
const TestTools = () => import('pages/testtools/TestTools')
const PublishManage = () => import('pages/publishmanage/PublishManage')
const Report = () => import('pages/report/Report')
const Mock = () => import('pages/mockserver/Mock')
const Job = () => import('pages/job/Jobs')
const ReportDetails =() => import('pages/report/ReportDetails')
const YmlEdit = () => import("pages/ymledit/YmlEdit")
// const PyEdit = () => import("pages/pyedit/Pyedit")
const LogManage = () => import('pages/logmanage/LogManage')
const ErrorMsgManage = () => import('pages/errormsgmanage/ErrorMsgManage')
const ErrorMsgDetails = () => import('pages/errormsgmanage/ErrorMsgDetails')

import Menu from '../components/common/Menu'
// 1.通过vue.use传入路由插件,安装插件
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    meta: {
      title: '登录'
    },
    redirect: '/login'
  },

  {
    path: '',
    component: Menu,
    children: [
      {
         path:'/home',
        component: Home,
        meta: {title: '首页'}
      }
    ]
  },
   {
    path: '/login',
    meta: {
      title: '登录'
    },
    component: Login
  },

  //嵌套路由
  {
    path: '/api',
    meta: {
      title: '接口测试'
    },
    component: Menu,
    children:[
      {
        path: 'project',
        meta: {title: '项目'},
        component: Project
      },
      {
        path: 'interface',
        component: Interface,
        meta: {
          title: '接口'
          },
      },
      {
        path: 'testcase',
        meta: {title: '测试用例'},
        component: Testcase
      },
      {
        path: "ymleditor",
        meta: {title: "用例编写"},
        component: YmlEdit
      },
      {
        path: 'report',
        meta: {title: '报告'},
        component: Report
      },
      {
        path: 'mock',
        meta: {title: 'mock'},
        component: Mock
        }

    ]
  },
 {
    path: '',
    component: Menu,
    children: [{
      meta: {title: '用户管理'},
      path: '/user',
      component: User}],
  },
 {
    path: '',
    component: Menu,
    children: [{
      path: '/testtools',
      component: TestTools,
      meta: {title: '测试工具'}}],
  },
  {
    path: '',
    component: Menu,
    children: [{
      path:'/publishmanage',
      component: PublishManage,
      meta: {title: '发布管理'}}],
  },
  {
    path:'/details',
    meta: {title: '报告详情'},
    component:ReportDetails
  },
  {
    path: '',
    component: Menu,
    children: [{
      path: '/jobs',
      component: Job,
      meta: {title: '定时任务'}}]
  },
  {
    path: '',
    component: Menu,
    children: [{
      path: '/logmanage',
      component: LogManage,
      meta: {title: '线上日志查看'}}]
  },
  {
    path: '',
    component: Menu,
    children: [{
      path: '/errormsgmanage',
      component: ErrorMsgManage,
      meta: {title: '线上错误信息管理'}}]
  },
    {
    path: '',
    component: Menu,
    children: [{
      path: '/errormsgdetails',
      component: ErrorMsgDetails,
      meta: {title: '线上错误信息详情'}}]
  },
]
// 2.创建路由对象
const router = new VueRouter({
  // 配置路由的映射关系
  routes,
  linkActiveClass: 'active'
})

router.beforeEach(
  (to, from, next) => {
    document.title = to.meta.title
    next()
  }
)

// 3.将router对象传入vue实例中
export default router
