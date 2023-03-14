<template>
  <div v-if="recentClipLists">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <a
        v-for="item in recentClipLists"
        :key="item.contentId"
        :href="`/detail/${item.clipName}`"
        class="min-w-fit overflow-hidden rounded-lg border bg-white transition-shadow duration-300 hover:shadow-2xl"
      >
        <div class="relative first-letter:aspect-w-16 aspect-h-9">
          <div>
            <img
              :src="`https://customer-lsoi5zwkd51of53g.cloudflarestream.com/${item.contentId}/thumbnails/thumbnail.jpg`"
              alt=""
            >
            <div
              class="absolute bottom-2 right-2 flex h-7 w-12 items-center justify-center rounded-lg bg-black/20 text-sm text-white backdrop-blur-sm"
            >
              {{
                item.clipDuration > 59
                  ? `1:${item.clipDuration - 60}`
                  : `0:${item.clipDuration}`
              }}
            </div>
          </div>
        </div>
        <div class="p-4">
          <div class="text-xl font-semibold line-clamp-1">
            {{ item.contentName }}
          </div>
          <div class="mb-3">
            {{ item.gameName }}
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
      v-if="recentClipLists.length - clipIndex * 12 === 0"
      class="mt-6 flex w-full items-center justify-center"
    >
      <button
        class="rounded-full bg-gray-200 px-6 py-3 transition-colors duration-300 hover:text-white active:bg-blue-500 md:hover:bg-blue-500"
        @click="loadMore"
      >
        더보기
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface Clip {
  clipCreatedAt: Date;
  clipDuration: number;
  clipLastEdited: Date;
  contentId: string;
  contentName: string;
  creatorId: number;
  creatorName: string;
  gameId: number;
  gameName: string;
  streamStartedAt: Date;
  clipName: string;
  __v: number;
  _id: string;
}

const VITE_API_URL = import.meta.env.VITE_API_URL;
const recentClipLists = ref<Clip[]>([]);
const clipIndex = ref(1);

onMounted(async () => {
  recentClipLists.value = (
    await axios.get(`${VITE_API_URL}/getRecentClip`)
  ).data;
});

async function loadMore() {
  const clipLists = await axios.get(
    `${VITE_API_URL}/getRecentClip?offset=${clipIndex.value}`,
  );
  clipIndex.value = clipIndex.value + 1;
  recentClipLists.value = recentClipLists.value.concat(clipLists.data);
}
</script>
