<template>
  <div class="mx-auto w-full max-w-7xl md:mt-6 md:p-6">
    <div
      class="group relative overflow-hidden md:mb-16 md:rounded-2xl md:shadow-2xl lg:mb-24"
    >
      <div
        class="flex h-36 items-start justify-end gap-2 border-b bg-slate-100 p-6 sm:h-52 md:h-64 lg:h-72"
        :class="{
          pattern: !user?.profileBackgroundUrl,
          bg: user?.profileBackgroundUrl,
        }"
        :style="{
          'background-image': user?.profileBackgroundUrl
            ? `url('https://cdn.naseong.kim/${user.profileBackgroundUrl}')`
            : '',
        }"
      >
        <div
          v-if="user?.follow && user.userType !== 'streamer'"
          class="flex h-9 items-center justify-center rounded-full bg-green-500 px-4 text-sm text-white shadow-lg shadow-green-600"
        >
          {{ dayjs().diff(dayjs(user?.follow), "M") }}개월 팔로우 중
        </div>
        <div
          v-if="user?.subscription && user.userType !== 'streamer'"
          class="flex h-9 items-center justify-center rounded-full px-4 text-sm text-white shadow-lg"
          :class="{
            'bg-green-500 shadow-green-600': user?.subscription === 1000,
            'bg-red-500 shadow-red-600': user?.subscription === 2000,
            'bg-purple-500 shadow-purple-600': user?.subscription === 3000,
          }"
        >
          {{ tier }} 구독자
        </div>
        <div
          v-if="user?.userType === 'streamer'"
          class="flex h-9 items-center justify-center rounded-full bg-orange-500 px-4 text-sm text-white shadow-lg shadow-orange-600"
        >
          스트리머
        </div>
        <div
          v-if="user?.userType === 'editor'"
          class="flex h-9 items-center justify-center rounded-full bg-green-500 px-4 text-sm text-white shadow-lg shadow-green-600"
        >
          편집자
        </div>
        <div
          v-if="user?.userType === 'developer'"
          class="flex h-9 items-center justify-center rounded-full bg-blue-500 px-4 text-sm text-white shadow-lg shadow-blue-600"
        >
          개발자
        </div>
        <button
          v-if="user?.twitchUserId === me?.twitchUserId"
          class="absolute bottom-20 mb-2 -mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/30 text-black backdrop-blur-xl hover:bg-white/70 group-hover:flex md:mb-6 md:mr-0 md:hidden md:h-12 md:w-12 md:rounded-2xl"
          @click="setIsOpen(true)"
        >
          <i class="xi-image-o xi-x" />
        </button>
        <Dialog
          :open="isOpen"
          class="fixed top-1/2 left-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black/30 backdrop-blur-sm"
          @close="setIsOpen"
        >
          <DialogPanel
            class="h-full w-full max-w-[512px] border bg-white p-6 sm:h-auto sm:rounded-2xl"
          >
            <DialogTitle class="mb-6 text-2xl font-bold">
              프로필 배경 바꾸기
            </DialogTitle>
            <div class="mb-2">
              어떤 이미지로 변경할까요?
            </div>
            <input
              ref="profileBgInput"
              class="mb-12 w-full rounded-2xl bg-slate-200 px-4 py-3"
              type="file"
              accept="image/png, image/jpeg"
            >
            <div class="flex justify-end gap-3">
              <button
                class="rounded-2xl bg-slate-200 px-4 py-3 transition-all duration-300 md:hover:shadow-lg md:hover:shadow-slate-300"
                @click="setIsOpen(false)"
              >
                그만두기
              </button>
              <button
                class="rounded-2xl bg-slate-200 px-4 py-3 transition-all duration-300 md:hover:shadow-lg md:hover:shadow-slate-300"
                @click="deleteBg"
              >
                기본값
              </button>
              <button
                class="rounded-2xl bg-blue-500 px-4 py-3 text-white transition-all duration-300 md:hover:shadow-lg md:hover:shadow-blue-600"
                @click="uploadBg"
              >
                바꾸기
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </div>
      <div
        class="bottom-0 flex w-full flex-col bg-slate-100/70 px-6 pb-6 backdrop-blur-lg md:absolute"
      >
        <div class="h-6 w-full">
          <img
            class="h-20 w-20 -translate-y-1/2 overflow-hidden rounded-full border bg-white p-1 sm:h-24 sm:w-24"
            :src="user?.profileImageUrl"
            alt=""
          >
        </div>
        <div class="text-right text-xl md:text-2xl lg:text-3xl">
          {{ user?.displayName }}
        </div>
      </div>
    </div>
    <div class="p-6 md:p-0">
      <div class="mb-4 text-2xl font-bold">
        {{ user?.displayName }}님의 클립
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          v-for="item in clips"
          :key="item.clipName"
          :href="`/detail/${item.clipName}`"
          class="min-w-fit overflow-hidden rounded-lg border bg-white transition-shadow duration-300 hover:shadow-2xl"
        >
          <div class="relative aspect-w-16 aspect-h-9">
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
            <div class="mb-2 text-xl font-semibold line-clamp-1">
              {{ item.contentName }}
            </div>
            <div style="overflow-wrap: anywhere">
              {{ dayjs().locale("ko").to(dayjs(item.clipCreatedAt)) }}
            </div>
          </div>
        </a>
      </div>
      <div
        v-if="clips.length - clipIndex * 12 > 12"
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
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuth } from '../plugins/useAuth';
import { useAuthStore } from '../stores/auth';
import { useRoute } from 'vue-router';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface User {
  displayName: string;
  email: string | undefined;
  profileImageUrl: string;
  profileBackgroundUrl: string;
  twitchUserId: number;
  userType: string;
  follow: Date | undefined;
  subscription: number | undefined;
}

interface Clips {
  clipCreatedAt: Date;
  clipDuration: number;
  clipLastEdited: Date;
  contentId: string;
  contentName: string;
  creatorId: number;
  creatorName: string;
  gameId: number;
  streamStartedAt: Date;
  clipName: string;
  __v: number;
  _id: string;
}

const VITE_API_URL: string = import.meta.env.VITE_API_URL;

const auth = useAuth();
const authStore = useAuthStore();
const route = useRoute();
const me = ref<User>();
const user = ref<User>();
const profileBgInput = ref<HTMLInputElement>();
const clips = ref<Clips[]>([]);
const clipIndex = ref(1);
const isOpen = ref(false);

function setIsOpen(value: boolean) {
  isOpen.value = value;
}

onMounted(async () => {
  me.value = await authStore.whoami();

  const userData = await axios.get(`${VITE_API_URL}/getUser`, {
    headers: {
      id: route.params.id,
    },
  });
  user.value = userData.data;

  const clipsData = await axios.get(`${VITE_API_URL}/getUserClips?offset=0`, {
    headers: {
      id: route.params.id,
    },
  });

  clips.value = clipsData.data;
});

const tier = computed((): string | undefined => {
  if (user.value?.subscription === 1000) {
    return '1티어';
  } else if (user.value?.subscription === 2000) {
    return '2티어';
  } else if (user.value?.subscription === 3000) {
    return '3티어';
  } else {
    return undefined;
  }
});

async function loadMore() {
  const clipLists = await axios.get(
    `${VITE_API_URL}/getClipLists?offset=${clipIndex.value}`,
  );
  clipIndex.value = clipIndex.value + 1;

  for (let i = 0; i < clipLists.data.length; i++) {
    clips.value.push(clipLists.data[i]);
  }
}

async function uploadBg() {
  if (!profileBgInput.value?.files || !user.value) {
    return;
  }

  const now = new Date().getTime();
  const url = await axios
    .get(
      `${VITE_API_URL}/getSignedUrl?filename=${user.value?.twitchUserId}-bg-${now}`,
    )
    .catch(async function() {
      await auth.refreshAuthority();
      return await axios.get(
        `${VITE_API_URL}/getSignedUrl?filename=${user.value?.twitchUserId}-bg-${now}`,
      );
    });

  await axios.put(url.data.signedUrl, profileBgInput.value?.files[0], {
    headers: { 'Content-Type': profileBgInput.value?.files[0].type },
  });

  const updateBg = await axios
    .post(`${VITE_API_URL}/updateBg`, {
      contentId: `${user.value?.twitchUserId}-bg-${now}`,
    })
    .catch(async function() {
      await auth.refreshAuthority();
      return await axios.post(`${VITE_API_URL}/updateBg`, {
        contentId: `${user.value?.twitchUserId}-bg-${now}`,
      });
    });

  user.value.profileBackgroundUrl = updateBg.data;
  setIsOpen(false);
}

async function deleteBg() {
  if (!user.value) {
    return;
  }

  await axios
    .post(`${VITE_API_URL}/updateBg`, {
      contentId: '',
    })
    .catch(async function() {
      await auth.refreshAuthority();
      return await axios.post(`${VITE_API_URL}/updateBg`, {
        contentId: '',
      });
    });

  user.value.profileBackgroundUrl = '';
  setIsOpen(false);
}
</script>
<style>
.pattern {
  background-color: #dfdbe5;
  background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
}
.bg {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
