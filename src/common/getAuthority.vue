<template>
  <div class="mx-auto mt-6 w-full max-w-7xl p-6">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
const VITE_API_URL = import.meta.env.VITE_API_URL;
const text = ref('쟘시만 기다려 주세요...');

onMounted(async () => {
  const queries = window.location.search;
  const params = new URLSearchParams(queries);
  const code = params.get('code') as string;
  const type = params.get('type') as string;

  await axios.get(`${VITE_API_URL}/authorization`, {
    headers: { code },
  });

  if (type === 'extension') {
    text.value = '확장 프로그램에 로그인했어요. 이 창을 닫고 확장 프로그램을 다시 실행해주세요.';
  } else {
    window.location.href = '/';
  }
});
</script>
