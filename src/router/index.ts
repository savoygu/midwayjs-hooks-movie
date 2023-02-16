import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../store/user';

import Layout from '../layout/Layout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
          title: '电影首页',
        },
      },
      {
        path: '/movie/:id',
        name: 'Movie',
        component: () => import('../views/Movie.vue'),
        meta: {
          title: '电影详情',
        },
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue'),
        meta: {
          title: '电影搜索',
        },
      },
    ],
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('../views/SignIn.vue'),
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue'),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  const userStore = await useUserStore();
  if (!userStore.user && to.name !== 'SignIn') {
    const [expires, user] = await userStore.check();
    if (!expires) {
      userStore.save(user);
    }
    next();
  } else if (userStore.user && to.name === 'SignIn') {
    next({ path: '/' });
  } else next();
});
