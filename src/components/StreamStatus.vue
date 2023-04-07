<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface StreamInfo {
  id: number;
  user_id: number;
  user_login: string;
  user_name: string;
  game_id: number;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: Date;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  tags: string[];
  is_mature: boolean;
}

const auth = useAuthStore();
const streamInfo = ref<StreamInfo | undefined>();
const status = ref('loading');

onMounted(async () => {
  streamInfo.value = await auth.getStreamInfo();
  streamInfo.value
    ? (status.value = 'online')
    : streamInfo.value === undefined
      ? (status.value = 'offline')
      : (status.value = 'error');
});
</script>
<template>
  <div
    class="hidden w-full max-w-xs flex-col justify-between rounded-3xl border bg-white p-6 transition-all duration-300 lg:flex"
    :class="{
      'lg:shadow-xl': streamInfo,
      'bg-slate-50': !streamInfo,
    }"
  >
    <div
      v-if="streamInfo"
      class="mb-6 flex justify-between"
    >
      <span>지금 방송 중!</span>
      <span>{{ dayjs().locale("ko").to(dayjs(streamInfo?.started_at)) }}</span>
    </div>
    <div
      class="line-clamp-1 flex items-end text-xl font-semibold md:line-clamp-2"
    >
      {{
        status === "online"
          ? streamInfo?.title
          : status === "offline"
            ? "오프라인"
            : status === "error"
              ? "방송 정보 없음"
              : "불러오는 중"
      }}
    </div>
    <div
      v-if="streamInfo"
      class="line-clamp-1"
    >
      {{ streamInfo?.game_name }}
    </div>
  </div>
</template>
