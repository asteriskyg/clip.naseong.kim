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
  <div class="mx-auto mt-6 w-full max-w-7xl p-6">
    {{ text }}
  </div>
</template>
