<script setup lang="ts">
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
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

const props = defineProps<{
  item: Clip;
}>();
</script>
<template>
  <a
    :href="`/detail/${props.item.clipName}`"
    class="inline-flex w-full flex-col divide-y divide-gray-200 overflow-hidden rounded-lg border bg-white transition-colors duration-300 ease-in-out hover:bg-slate-100 dark:divide-neutral-600 dark:border-neutral-600 dark:bg-twitch-dark hover:dark:bg-neutral-800"
  >
    <div class="relative aspect-video bg-slate-100 dark:bg-neutral-800">
      <img
        :src="`https://customer-lsoi5zwkd51of53g.cloudflarestream.com/${props.item.contentId}/thumbnails/thumbnail.jpg`"
        alt=""
      >
      <div
        class="absolute bottom-2 right-2 flex h-6 w-11 items-center justify-center rounded-lg bg-twitch-dark/60 text-sm text-white backdrop-blur-md"
      >
        {{
          props.item.clipDuration > 59
            ? props.item.clipDuration - 60 < 10
              ? `1:0${props.item.clipDuration - 60}`
              : `1:${props.item.clipDuration - 60}`
            : props.item.clipDuration < 10
              ? `0:0${props.item.clipDuration}`
              : `0:${props.item.clipDuration}`
        }}
      </div>
    </div>
    <div class="px-4 py-4 text-black dark:text-slate-200 sm:px-6">
      <div class="line-clamp-1 text-xl font-semibold">
        {{ props.item.contentName }}
      </div>
      <div class="mb-3">
        {{ props.item.gameName }}
      </div>
      <div style="overflow-wrap: anywhere">
        {{ props.item.creatorName }}
      </div>
      <div style="overflow-wrap: anywhere">
        {{ dayjs().locale("ko").to(dayjs(props.item.clipCreatedAt)) }}
      </div>
    </div>
  </a>
</template>
