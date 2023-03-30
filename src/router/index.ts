import { createRouter, createWebHistory } from "vue-router";
import chainlinkRoute from './chainlink'
import projectsRoute from './projects'
let router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/home",
      name: "home",
      component: () => import('@/views/home/HomeView.vue'),
    },
    {
      path: '/',
      redirect: '/login',
      children: [
        {
          path: '/login',
          name: 'Login',
          component: () => import('@/views/login/index.vue'),
        }
      ],
      meta: {
        layout: 'null',
      }
    },
    {
      path: '/loginTransition',
      name: 'LoginTransition',
      component: () => import('@/views/login/loginTransition.vue'),
      meta: {
        layout: 'null',
      }
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: () => import('@/views/login/welcome.vue'),
      meta: {
        layout: 'null',
      }
    },
    ...chainlinkRoute,
    ...projectsRoute
  ],
});


router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  const token = localStorage.getItem('token') || '';
  if (!token) {
    if (to.path !== '/login' && to.path !== '/loginTransition') {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;
