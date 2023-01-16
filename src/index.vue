<template>
  <div class="min-w-full min-h-full">
    <div class="sticky w-full top-0 bg-gray-100/50 backdrop-blur-lg border-b">
      <div class="flex w-full h-20 px-6 max-w-7xl justify-end items-center m-auto">
        <div v-if="me">
          <img :src="me.profileImageUrl" class="w-10 h-10 rounded-full border-2" alt="">
        </div>
        <a v-if="!loginStatus"
           href="https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=0373yf8vzqpo4f9ln4ajqrq9fim3hd&redirect_uri=https://naseong.kim/authorization&scope=clips%3Aedit%20user%3Aread%3Aemail"
           class="py-2 px-4 rounded-full text-white bg-[#9146ff]"
        >로그인</a>

      </div>
    </div>
    <div class="w-full max-w-7xl mx-auto p-6 mt-6">
      <div class="text-4xl font-extrabold mb-4">기능 준비중입니다.</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuth } from './plugins/useAuth'
import axios from 'axios';

const loginStatus = ref(true)
const me:any = ref()

onMounted(async () => {
  const auth = useAuth();
  const status = await auth.checkAuthority()
  loginStatus.value = status

  if(status === true) {
    const accessToken = localStorage.getItem('access_token');
    const userData = await axios.get('https://api.naseong.kim/whoami', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    me.value = userData.data
  }
})
</script>
