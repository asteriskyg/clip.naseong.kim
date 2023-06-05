<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const VITE_API_URL = import.meta.env.VITE_API_URL;
const text = ref('잠시만 기다려 주세요...');
const route = useRoute();

onMounted(async () => {
  await axios.get(`${VITE_API_URL}/auth/login?code=${route.query.code}`);

  if (route.query.type === 'extension') {
    text.value = '확장 프로그램에 로그인했어요. 이 창을 닫고 확장 프로그램을 다시 실행해주세요.';
    return;
  }

  location.href = '/';
});
</script>
<template>
  <div class="mx-auto w-full max-w-7xl p-6 text-2xl text-black dark:text-slate-200">
    <svg
      class="animate-spin h-8 w-8 text-white mb-3"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    {{ text }}
  </div>
</template>
