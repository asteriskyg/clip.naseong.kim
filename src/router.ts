import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: async () => await import('./index.vue'),
  },
  {
    path: '/extension',
    component: async () => await import('./extensionIndex.vue'),
  },
  {
    path: '/get',
    component: async () => await import('./extensionIndex.vue'),
  },
  {
    path: '/import',
    component: async () => await import('./importClip.vue'),
  },
  {
    path: '/authorization',
    component: async () => await import('./common/getAuthority.vue'),
  },
  {
    path: '/detail/:id',
    component: async () => await import('./clip/clipDetail.vue'),
  },
  {
    path: '/profile/:id',
    component: async () => await import('./common/userProfile.vue'),
  },
  {
    path: '/live',
    component: async () => await import('./LiveStream.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: async () => await import('./common/notFound.vue'),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
