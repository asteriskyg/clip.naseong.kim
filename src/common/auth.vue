<template>
  <div class="mx-auto mt-6 w-full max-w-7xl p-6">잠시만 기다려주세요...</div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted } from "vue";
const VITE_API_URL = import.meta.env.VITE_API_URL;

onMounted(async () => {
  const queries = window.location.search;
  const params = new URLSearchParams(queries);
  const code = params.get("code") as string;

  const token = await axios.get(`${VITE_API_URL}/authorization`, {
    headers: {
      code: code,
    },
  });

  localStorage.setItem("access_token", token.data.access_token);
  localStorage.setItem("refresh_token", token.data.refresh_token);

  window.location.href = "/";
});
</script>
