<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/auth';
import axios from 'axios';

interface Me {
  displayName: string;
  email: string;
  profileImageUrl: string;
  profileBackgroundUrl: string;
  twitchUserId: number;
  userType: string;
  follow: Date | undefined;
  subscription: number | undefined;
}

const VITE_HOST_URL = import.meta.env.VITE_HOST_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const authStore = useAuthStore();
const loginStatus = ref(true);
const me = ref<Me | undefined | null>();
const modal = ref(false);
const status = ref('loading');

onMounted(async () => {
  window.postMessage({ status: 'online' }, VITE_HOST_URL);
  me.value = await authStore.whoami();

  if (!me.value) {
    loginStatus.value = false;
    status.value = 'login';
  }
});

const logout = async () => {
  await axios.get(`${VITE_API_URL}/logout`);
  window.location.href = '/extension';
};
</script>
<template>
  <div class="w-full border-b bg-slate-100/50 backdrop-blur-lg">
    <div class="m-auto w-full max-w-sm px-6 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-3xl">
          <a
            href="/"
            target="_blank"
            class="text-3xl"
          >na.<b>clip</b></a>
        </div>
        <button v-if="me">
          <img
            :src="me.profileImageUrl"
            class="h-10 w-10 rounded-full border"
            alt=""
            @click="modal = !modal"
          >
        </button>
      </div>
      <div v-if="modal">
        <div class="mt-6 flex flex-col rounded-3xl bg-slate-200 p-5">
          <img
            :src="me?.profileImageUrl"
            class="mb-3 h-16 w-16 rounded-2xl border-2"
            :alt="`${me?.displayName}님의 트위치 프로필 이미지`"
          >
          <span
            class="line-clamp-1 overflow-hidden text-xl font-semibold"
            style="overflow-wrap: anywhere"
          >
            {{ me?.displayName }}
          </span>
          <a
            :href="`${VITE_HOST_URL}/profile/${me?.twitchUserId}`"
            target="_blank"
            class="mt-6 cursor-pointer rounded-3xl bg-slate-100 p-4 text-center no-underline transition-all duration-300 hover:shadow-lg hover:shadow-slate-300"
          >내 프로필 보기
          </a>
          <button
            class="mt-2 cursor-pointer rounded-3xl bg-red-200 p-4 text-center transition-all duration-300 hover:shadow-lg hover:shadow-red-300"
            @click="logout"
          >
            로그아웃
          </button>
        </div>
        <div class="pt-2 text-center text-sm text-slate-500">
          확장 프로그램 버전 3.0.0
        </div>
      </div>
    </div>
  </div>
</template>
