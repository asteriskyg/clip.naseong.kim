<template>
  <div class="p-6">
    잠시만 기다려주세요...
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted } from 'vue'
import { router } from './router';

onMounted(async () => {
  const queries = window.location.search
  const params = new URLSearchParams(queries)
  const code = params.get('code') as string

  const token = await axios.get('https://api.naseong.kim/authorization', {
    headers: {
      code: code,
    }
  })

  console.log(token.data)

  localStorage.setItem('access_token', token.data.access_token);
  localStorage.setItem('refresh_token', token.data.refresh_token);

  router.push('/')
})
</script>
