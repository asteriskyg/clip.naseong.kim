import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: async () => await import('./index.vue'),
  },
  {
    path: '/authorization',
    component: async () => await import('./common/auth.vue'),
  },
  // {
  //   path:'/upload',
  //   component: () => import('/src/upload.vue'),
  //   beforeEnter: async function(to, from, next) {
  //     const response = await auth.checkAuthority();

  //     if (response) {
  //       next();
  //     } else {
  //       alert('로그인이 필요합니다.');
  //       next('/login');
  //     }
  //   }
  // },
  // {
  //   path:'/list',
  //   component: () => import('/src/list.vue')
  // },
  {
    path: '/detail/:id',
    component: async () => await import('./clip/detail.vue'),
  },
  {
    path: '/profile/:id',
    component: async () => await import('./common/profile.vue'),
  },
  // {
  //   path:'/create-image',
  //   component: () => import('/src/createImage.vue')
  // },
  {
    path: '/:pathMatch(.*)*',
    component: async () => await import('./common/404.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
