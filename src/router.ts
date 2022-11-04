import { createWebHistory, createRouter } from 'vue-router';

const routes = [
    {
        path:'/',
        component: ()=> import('/src/index.vue')
    },
    { 
        path: '/:pathMatch(.*)*', 
        component: ()=> import('/src/404.vue')
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});