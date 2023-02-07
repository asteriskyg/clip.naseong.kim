<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <a
      v-for="item in recentClipLists"
      :key="item.contentId"
      :href="`/detail/${item.contentId}`"
      class="min-w-fit overflow-hidden rounded-xl border bg-white transition-shadow duration-300 hover:shadow-2xl"
    >
      <div class="aspect-w-16 aspect-h-9">
        <img
          :src="`https://customer-lsoi5zwkd51of53g.cloudflarestream.com/${item.contentId}/thumbnails/thumbnail.jpg`"
          alt=""
        >
      </div>
      <div class="p-4">
        <div class="mb-2 text-xl font-semibold line-clamp-1">
          {{ item.contentName }}
        </div>
        <div style="overflow-wrap: anywhere">
          {{ item.creatorName }}
        </div>
        <div style="overflow-wrap: anywhere">
          {{ dayjs().locale("ko").to(dayjs(item.clipCreatedAt)) }}
        </div>
      </div>
    </a>
  </div>
  <div
    v-if="clipIndex <= 10"
    class="mt-6 flex w-full items-center justify-center"
  >
    <button
      class="rounded-full bg-gray-200 px-6 py-3 transition-colors duration-300 hover:text-white active:bg-blue-500 md:hover:bg-blue-500"
      @click="loadMore"
    >
      더보기
    </button>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const VITE_API_URL = import.meta.env.VITE_API_URL;
const recentClipLists: any = ref();
const clipIndex = ref(1);

onMounted(async () => {
  const recentClips = await axios.get(`${VITE_API_URL}/getRecentClip`);
  recentClipLists.value = recentClips.data;
});

async function loadMore() {
  const clipLists = await axios.get(
    `${VITE_API_URL}/getClipLists?offset=${clipIndex.value}`,
  );
  clipIndex.value = clipIndex.value + 1;

  for (let i = 0; i < clipLists.data.length; i++) {
    recentClipLists.value.push(clipLists.data[i]);
  }

  if (clipLists.data.length < 12) {
    clipIndex.value = 999;
  }
}
</script>
