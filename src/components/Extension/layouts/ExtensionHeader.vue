<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/auth';
import axios from 'axios';
import { useAuth } from '../../../plugins/useAuth';
import ToggleDark from '../../ToggleDark.vue';
import { useRoute } from 'vue-router';
const VITE_HOST_URL = import.meta.env.VITE_HOST_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const route = useRoute();
const auth = useAuth();
const store = useAuthStore();
const loginStatus = ref(true);
const me = ref<typeof store.me>();
const modal = ref(false);
const status = ref('loading');

onMounted(async () => {
  // const asdf = window.postMessage({ status: 'online' }, VITE_HOST_URL);
  me.value = await store.whoami();

  if (!me.value) {
    loginStatus.value = false;
    status.value = 'login';
  }
});

async function logout() {
  await axios
    .get(`${VITE_API_URL}/auth/logout`)
    .catch(async () => {
      await auth.refreshAuthority();
      return await axios.get(`${VITE_API_URL}/auth/logout`);
    });

  localStorage.removeItem('me');
  window.location.href = route.path;
}
</script>
<template>
  <div class="sticky top-0 w-full border-b dark:border-neutral-600 bg-slate-50/90 dark:bg-twitch-dark/90 backdrop-blur-lg transition-all duration-300 ease-in-out">
    <div class="m-auto flex flex-col justify-center w-full max-w-7xl min-h-[56px] px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-2xl">
          <a
            :href="route.path === '/get' ? '/' : route.path === 'extension' ? '/extension' : route.path"
            class="text-2xl text-black dark:text-slate-200"
          >na.<b>clip</b></a>
        </div>
        <div class="flex items-center gap-6">
          <ToggleDark />
          <button v-if="me">
            <img
              :src="me.profileImageUrl"
              class="h-8 w-8 rounded-full border dark:border-neutral-600"
              alt=""
              @click="modal = !modal"
            >
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="modal"
    class="m-auto max-w-sm"
  >
    <div class="w-full p-6">
      <div class="flex flex-col rounded-3xl bg-slate-100 dark:bg-neutral-800 p-6 text-black dark:text-slate-200">
        <img
          :src="me?.profileImageUrl"
          class="mb-3 h-16 w-16 rounded-2xl border-2"
          :alt="`${me?.displayName}님의 트위치 프로필 이미지`"
        >
        <span class="line-clamp-1 overflow-hidden text-2xl">
          {{ me?.displayName }}
        </span>
        <a
          :href="`${VITE_HOST_URL}/profile/${me?.twitchUserId}`"
          target="_blank"
          class="mt-6 cursor-pointer rounded-3xl bg-slate-200 hover:bg-slate-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 p-4 text-center no-underline transition-all duration-300"
        >내 프로필 보기
        </a>
        <button
          class="mt-2 cursor-pointer rounded-3xl bg-red-500 dark:bg-red-800/50 hover:bg-red-600 dark:hover:bg-red-800 disabled:hover:bg-red-800/50 text-white dark:text-slate-200 p-4 transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
          @click="logout"
        >
          로그아웃
        </button>
        <div class="pt-4 text-center text-sm text-slate-500 dark:text-neutral-500">
          nsk-clipper 버전 4.0.0
        </div>
      </div>
    </div>
  </div>
</template>
