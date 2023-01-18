<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <a v-for="item in recentClipLists" :href="`/detail/${item.contentId}`" class="min-w-fit rounded-xl overflow-hidden border bg-white hover:shadow-2xl transition-shadow duration-300">
      <img :src="`https://customer-lsoi5zwkd51of53g.cloudflarestream.com/${item.contentId}/thumbnails/thumbnail.jpg`" alt="">
      <div class="p-4">
        <div class="text-xl font-semibold line-clamp-1 mb-2">
          {{ item.contentName }}
        </div>
        <div style="overflow-wrap: anywhere;">
          {{ item.creatorName }}
        </div>
        <div style="overflow-wrap: anywhere;">
          {{ dayjs().locale('ko').to(dayjs(item.clipCreatedAt)) }}
        </div>
      </div>
    </a>
  </div>
  <div v-if="clipIndex <= 10" class="w-full flex justify-center items-center mt-6">
    <button class="px-6 py-3 bg-gray-200 hover:bg-blue-500 hover:text-white rounded-full transition-colors duration-300  " v-if="clipIndex <= 10" @click="loadMore">더보기</button>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios';
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const VITE_API_URL = import.meta.env.VITE_API_URL;
const recentClipLists:any = ref()
let clipIndex = 1


onMounted(async () => {
  const recentClips = await axios.get(`${VITE_API_URL}/getRecentClip`)
  recentClipLists.value = recentClips.data
})

async function loadMore() {
  const clipLists = await axios.get(`${VITE_API_URL}/getClipLists?offset=${clipIndex}`)
  clipIndex += 1

  for(let i = 0; i < clipLists.data.length; i++) {
    recentClipLists.value.push(clipLists.data[i])
  }

  if (clipLists.data.length < 12) {
  clipIndex = 999
  }
}
</script>
