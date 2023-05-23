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
    class="min-w-fit overflow-hidden rounded-lg border bg-white dark:border-neutral-600 dark:bg-neutral-800 duration-300 hover:shadow-2xl hover:dark:bg-neutral-700"
  >
    <div class="relative aspect-video bg-slate-100 dark:bg-neutral-900">
      <img
        :src="`https://customer-lsoi5zwkd51of53g.cloudflarestream.com/${props.item.contentId}/thumbnails/thumbnail.jpg`"
        alt=""
      >
      <div
        class="absolute bottom-2 right-2 flex h-7 w-12 items-center justify-center rounded-lg bg-black/20 text-sm text-white backdrop-blur-sm"
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
    <div class="p-4">
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
