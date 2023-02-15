import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../store/user';

import Layout from '../layout/Layout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
      {
        path: '/movie/:id',
        name: 'Movie',
        component: () => import('../views/Movie.vue'),
      },
      {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue'),
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
