import Vue from 'vue'
import VueRouter from 'vue-router'
import { done, start } from '@/utils/nProgress'
import LoginView from '../views/LoginView.vue'
import UserManage from '@/views/UserManage.vue'
import PersonalInfo from '@/views/PersonalInfo.vue'
import ChangePassword from '@/views/ChangePassword.vue'
import layout from '@/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: {
      isAuth: false, // 是否需要登录才可以访问
    }
  },
  {
    path: '/manage',
    component: layout,
    children: [
      {
        path: '',
        name: 'manage',
        component: UserManage,
        meta: {
          isAuth: true,
        }
      }
    ]
  },
  {
    path: '/info',
    component: layout,
    children: [
      {
        path: '',
        name: 'info',
        component: PersonalInfo,
        meta: {
          isAuth: true,
        }
      }
    ]
  },
  {
    path: '/changePassword',
    component: layout,
    children: [
      {
        path: '',
        name: 'changePassword',
        component: ChangePassword,
        meta: {
          isAuth: true,
        }
      }
    ]
  },
  // {
  //   path: '/manage',
  //   name: 'manage',
  //   component: UserManage,
  //   meta: {
  //     isAuth: true,
  //   }
  // },
  // {
  //   path: '/info',
  //   name: 'info',
  //   component: PersonalInfo,
  //   meta: {
  //     isAuth: true,
  //   }
  // },
  // {
  //   path: '/changePassword',
  //   name: 'changePassword',
  //   component: ChangePassword,
  //   meta: {
  //     isAuth: true,
  //   }
  // }
]


const router = new VueRouter({
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  start();
  if (to.meta.isAuth) {
    if (sessionStorage.getItem('token') != null) {
      next(); // 放行
    } else {
      alert('您还没有登录！');
      next('/')
      done();
    }
  } else {
    next();
  }
})

router.afterEach(() => {
  done();
})

export default router
