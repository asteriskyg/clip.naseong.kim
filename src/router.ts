import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import { useAuth } from "./plugins/useAuth";

const auth = useAuth();

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("/src/index.vue"),
  },
  {
    path: "/authorization",
    component: () => import("/src/common/auth.vue"),
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
    path: "/detail/:id",
    component: () => import("/src/clip/detail.vue"),
  },
  // {
  //   path:'/create-image',
  //   component: () => import('/src/createImage.vue')
  // },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("/src/common/404.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
