<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ClipItem from './ClipItem.vue';

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

const props = defineProps<{
  title: string;
  get: string;
}>();

const VITE_API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const recentClipLists = ref<Clip[]>();
const clipIndex = ref(1);

onMounted(async () => {
  if (props.get === 'recent') {
    recentClipLists.value = (
      await axios.get(`${VITE_API_URL}/clip/recent`)
    ).data;
  } else if (props.get === 'user') {
    recentClipLists.value = (
      await axios.get(`${VITE_API_URL}/clip/user?id=${route.params.id}`)
    ).data;
  }
});

const more = async () => {
  if (props.get === 'recent') {
    const clipLists = await axios.get(
      `${VITE_API_URL}/clip/recent?offset=${clipIndex.value}`,
    );
    recentClipLists.value = recentClipLists.value?.concat(clipLists.data);
  } else if (props.get === 'user') {
    const clipLists = await axios.get(
      `${VITE_API_URL}/clip/user?id=${route.params.id}&offset=${clipIndex.value}`,
    );
    recentClipLists.value = recentClipLists.value?.concat(clipLists.data);
  }

  clipIndex.value = clipIndex.value + 1;
};
</script>
<template>
  <div class="mb-4 text-2xl text-black dark:text-slate-200">
    {{ props.title }}
  </div>
  <div v-if="recentClipLists">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      <ClipItem
        v-for="item in recentClipLists"
        :key="item.contentId"
        :item="item"
      />
    </div>
    <div
      v-if="recentClipLists.length - clipIndex * 12 === 0"
      class="mt-6 flex w-full items-center justify-center"
    >
      <button
        class="px-6 py-3 rounded-full bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 active:bg-blue-500 text-black dark:text-slate-200 transition-colors duration-300 ease-in-out"
        @click="more"
      >
        더보기
      </button>
    </div>
  </div>
  <div v-else>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 animate-pulse">
      <div
        v-for="items in 12"
        :key="items"
        class="min-w-fit overflow-hidden rounded-lg border bg-white dark:border-neutral-600 dark:bg-twitch-dark"
      >
        <div class="aspect-video bg-slate-100 dark:bg-neutral-800" />
        <div class="flex flex-col p-4">
          <span class="text-xl text-black dark:text-slate-200">클립 로딩 중...</span>
        </div>
      </div>
    </div>
  </div>
</template>
