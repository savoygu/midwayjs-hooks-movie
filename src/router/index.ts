import { createRouter, createWebHashHistory } from 'vue-router';
import { useUserStore } from '../store/user';

const routes = [
  { path: '/', name: 'Home', component: import('../views/Home.vue') },
  {
    path: '/movie/:id',
    name: 'Movie',
    component: import('../views/Movie.vue'),
  },
  { path: '/signin', name: 'SignIn', component: import('../views/SignIn.vue') },
  { path: '/signup', name: 'SignUp', component: import('../views/SignUp.vue') },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const userStore = await useUserStore();
  if (!userStore.user && to.name !== 'SignIn') {
    const [expires, user] = await userStore.check();
    if (expires) {
      return { name: 'SignIn' };
    } else {
      userStore.save(user);
      next();
    }
  } else if (userStore.user && to.name === 'SignIn') {
    return { path: '/' };
  } else next();
});
