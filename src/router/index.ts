import * as _ from 'lodash'
import { createWebHashHistory, createRouter, RouteRecordRaw } from 'vue-router'
import store from '@/store/index'
import { useLoginStore } from '@/store/login'
const Login = import('@/views/Login/Login.vue')
const ProductManager = import('@/views/ProductManager/ProductManager.vue')
const Layout = import('@/views/Layout.vue')
const Dashboard = import('@/views/Dashboard/Dashboard.vue')
const AddProduct = import('@/views/ProductManager/AddProduct.vue')
const ProjectManager = import('@/views/ProjectManager/ProjectManager.vue')
const ProjectInput = import('@/views/ProjectManager/ProjectInput.vue')
const ProjectComputed = import('@/views/ProjectManager/ProjectComputed.vue')
const AddChannel = import('@/views/Channel/AddChannel.vue')
const ChannelList = import('@/views/Channel/ChannelList.vue')
const ProjectList = import('@/views/ProjectTable/ProjectList.vue')
const AddProjectTable = import('@/views/ProjectTable/AddProjectTable.vue')
const TeamManager = import('@/views/Person/TeamManager.vue')
const AddRule = import('@/views/Person/AddRule.vue')
const RuleList = import('@/views/Person/RuleList.vue')
const PersonList = import('@/views/Person/PersonList.vue')
const Compute = import('@/views/Compute/Compute.vue')
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    name?: string
    requireAuth?: boolean
    icon?: string
    hidden?: boolean
  }
}

export const menuRouts: Array<RouteRecordRaw> = [
  {
    path: '/productManager',
    name: 'productManager',
    component: () => Layout,
    meta: {
      title: '产品管理',
      name: 'productManager',
      icon: 'Folder'
    },
    children: [
      {
        path: 'productList',
        name: 'productList',
        component: () => ProductManager,
        meta: {
          title: '产品列表',
          requireAuth: true
        }
      },
      {
        path: 'addProduct',
        name: 'addProduct',
        component: () => AddProduct,
        meta: {
          title: '添加产品',
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/projectManager',
    name: 'projectManager',
    component: () => Layout,
    meta: {
      title: '项目管理',
      name: 'Manager',
      icon: 'Folder'
    },
    children: [
      {
        path: 'projectManager',
        name: 'projectManager',
        component: () => ProjectManager,
        meta: {
          title: '项目列表',
          requireAuth: true
        }
      },
      {
        path: 'projectInput',
        name: 'projectInput',
        component: () => ProjectInput,
        meta: {
          title: '项目录入',
          requireAuth: true
        }
      },
      {
        path: 'projectComputed/:id',
        name: 'projectComputed',
        component: () => ProjectComputed,
        meta: {
          title: '项目汇算',
          requireAuth: true,
          hidden: true
        }
      }
    ]
  },
  {
    path: '/channel',
    name: 'channel',
    component: () => Layout,
    meta: {
      title: '渠道跟进表',
      name: 'channel',
      icon: 'Folder'
    },
    children: [
      {
        path: 'channelList',
        name: 'channelList',
        component: () => ChannelList,
        meta: {
          title: '渠道跟进表',
          requireAuth: true
        }
      },
      {
        path: 'addChannel',
        name: 'addChannel',
        component: () => AddChannel,
        meta: {
          title: '添加渠道',
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/projectTable',
    name: 'projectTable',
    component: () => Layout,
    meta: {
      title: '项目跟进表',
      name: 'projectTable',
      icon: 'Folder'
    },
    children: [
      {
        path: 'projectList',
        name: 'projectList',
        component: () => ProjectList,
        meta: {
          title: '项目跟进表',
          requireAuth: true,
          name: 'projectList'
        }
      },
      {
        path: 'addProjectList',
        name: 'addProjectList',
        component: () => AddProjectTable,
        meta: {
          title: '添加项目跟进表',
          requireAuth: true,
          name: 'addProjectList'
        }
      }
    ]
  },
  {
    path: '/person',
    name: 'person',
    component: () => Layout,
    meta: {
      title: '人员管理',
      name: 'person',
      icon: 'Folder'
    },
    children: [
      {
        path: 'personList',
        name: 'personList',
        component: () => PersonList,
        meta: {
          title: '人员列表',
          requireAuth: true
        }
      },
      {
        path: 'ruleList',
        name: 'ruleList',
        component: () => RuleList,
        meta: {
          title: '角色列表',
          requireAuth: true
        }
      },

      {
        path: 'teamManager',
        name: 'teamManager',
        component: () => TeamManager,
        meta: {
          title: '团队管理',
          requireAuth: true
        }
      },
      {
        path: 'addRule',
        name: 'addRule',
        component: () => AddRule,
        meta: {
          title: '添加角色',
          requireAuth: true,
          hidden: true
        }
      }
    ]
  },
  {
    path: '/compute',
    name: 'compute',
    component: () => Layout,
    meta: {
      title: '计算公式',
      name: 'compute',
      icon: 'Folder'
    },
    children: [
      {
        path: 'compute',
        name: 'compute',
        component: () => Compute,
        meta: {
          title: '计算公式管理',
          requireAuth: true
        }
      }
    ]
  }
]

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      name: 'login',
      requireAuth: false
    },
    component: () => Login
  },
  {
    path: '/',
    name: 'dashboard',
    redirect: '/dashboard',
    meta: {
      title: '首页'
    },
    component: () => Layout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => Dashboard,
        meta: {
          title: '控制台',
          requireAuth: true,
          icon: 'DataAnalysis'
        }
      }
    ]
  },
  ...menuRouts
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')
  const loginInfo = useLoginStore(store)
  if (to.meta.requireAuth && _.isEmpty(userInfo)) {
    if (token) {
      loginInfo.getUserInfo().then(res => {
        if (res.data.code === 200) {
          loginInfo.userInfo = res.data.data
          localStorage.setItem('userInfo', JSON.stringify(res.data.data))
        }
        next()
      })
    } else {
      next('/login')
    }
  } else {
    if (token && to.path === 'login') {
      next('/')
    } else {
      next()
    }
  }
})

export default router
