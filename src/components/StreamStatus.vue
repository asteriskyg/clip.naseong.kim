<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const authStore = useAuthStore();
const streamInfo = ref<typeof authStore.streamInfo>();

onMounted(async () => {
  streamInfo.value = await authStore.getStreamInfo();
});
</script>
<template>
  <div
    class="hidden w-full max-w-xs flex-col justify-between rounded-3xl border bg-white p-6 transition-all duration-300 lg:flex"
    :class="{
      'border-blue-500 lg:shadow-xl lg:shadow-blue-200': streamInfo?.status === 'online',
      'bg-slate-50': streamInfo?.status !== 'online',
    }"
  >
    <span
      class="line-clamp-1 font-semibold"
      :class="{
        'text-2xl': streamInfo,
        'text-xl': !streamInfo,
      }"
    >
      {{
        streamInfo?.status === "online"
          ? streamInfo?.title
          : streamInfo?.status === "offline"
            ? "오프라인"
            : streamInfo?.status === "unknown"
              ? "방송 정보 없음"
              : "불러오는 중"
      }}
    </span>
    <div v-if="streamInfo?.status === 'online'">
      <div class="line-clamp-1">
        {{ streamInfo?.game_name }}
      </div>
      <div>{{ dayjs().locale("ko").to(dayjs(streamInfo?.started_at)) }}</div>
    </div>
  </div>
</template>
