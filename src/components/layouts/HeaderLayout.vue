<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import axios from 'axios';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

interface Me {
  displayName: string;
  email: string;
  profileImageUrl: string;
  profileBackgroundUrl: string;
  twitchUserId: number;
  userType: string;
  follow: Date | undefined;
  subscription: number | undefined;
}

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

const VITE_HOST_URL = import.meta.env.VITE_HOST_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const auth = useAuthStore();
const loginStatus = ref(true);
const me = ref<Me | undefined>();
const streamInfo = ref<StreamInfo | undefined>();
const modal = ref(false);

onMounted(async () => {
  if (window.location.pathname === '/authorization') return;
  me.value = await auth.whoami();
  streamInfo.value = await auth.getStreamInfo();
  me.value
    ? (loginStatus.value = true)
    : (loginStatus.value = false);
});

async function logout() {
  try {
    await axios.get(`${VITE_API_URL}/logout`);
    localStorage.removeItem('me');
    window.location.href = '/';
  } catch {
    await axios.get(`${VITE_API_URL}/refresh`);
    await axios.get(`${VITE_API_URL}/logout`);
    localStorage.removeItem('me');
    window.location.href = '/';
  }
}
</script>
<template>
  <div
    class="sticky top-0 z-10 w-full border-b bg-slate-50/90 backdrop-blur-lg"
  >
    <div class="flex justify-center items-center w-full max-w-7xl px-6 h-16 sm:h-[88px]">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-4">
          <a
            href="/"
            class="text-2xl sm:text-3xl"
          > na.<b>clip</b></a>
          <button
            v-if="streamInfo"
            class="select-none rounded-full bg-red-500 px-4 py-1 text-sm text-white shadow-lg shadow-red-600"
            @click="modal = !modal"
          >
            LIVE
          </button>
        </div>
        <div v-if="me">
          <Menu>
            <div class="relative w-8 h-8 sm:h-10 sm:w-10">
              <MenuButton>
                <img
                  :src="me.profileImageUrl"
                  class="rounded-full border"
                  alt=""
                >
              </MenuButton>
              <MenuItems
                class="absolute right-0 z-10 flex w-48 flex-col overflow-hidden rounded-xl border bg-white shadow-2xl"
              >
                <div class="border-b px-4 pt-3 pb-2">
                  <div class="text-sm">
                    로그인 된 계정
                  </div>
                  <div class="text-lg font-semibold">
                    {{ me.displayName }}
                  </div>
                </div>
                <div class="border-b bg-slate-100 px-4 py-2 text-slate-500">
                  <div>바로가기</div>
                </div>
                <MenuItem v-slot="{ active }">
                  <a
                    href="https://tgd.kr/s/naseongkim"
                    target="_blank"
                    class="px-5 py-3 text-left text-[#6441A5] transition-all duration-300"
                    :class="{ 'bg-[#6441A5]/20': active }"
                  >
                    트게더
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="https://www.twitch.tv/naseongkim"
                    target="_blank"
                    class="px-5 py-3 text-left text-[#9146ff] transition-all duration-300"
                    :class="{ 'bg-[#9146ff]/20': active }"
                  >
                    트위치
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="https://www.youtube.com/@Naseongkim"
                    target="_blank"
                    class="border-b px-5 py-3 text-left text-[#FF0000] transition-all duration-300"
                    :class="{ 'bg-[#FF0000]/20': active }"
                  >
                    유튜브
                  </a>
                </MenuItem>
                <div class="border-b bg-slate-100 px-4 py-2 text-slate-500">
                  <div>설정</div>
                </div>
                <MenuItem v-slot="{ active }">
                  <a
                    :href="`/profile/${me.twitchUserId}`"
                    class="px-5 py-3 text-left transition-all duration-300"
                    :class="{ 'bg-blue-100': active }"
                  >
                    내 프로필
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    class="px-5 py-3 text-left transition-all duration-300"
                    :class="{ 'bg-blue-100': active }"
                    @click="logout"
                  >
                    로그아웃
                  </button>
                </MenuItem>
              </MenuItems>
            </div>
          </Menu>
        </div>
        <a
          v-if="!loginStatus"
          :href="`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=0373yf8vzqpo4f9ln4ajqrq9fim3hd&redirect_uri=${VITE_HOST_URL}/authorization&scope=clips%3Aedit%20user%3Aread%3Aemail%20user%3Aread%3Asubscriptions`"
          class="rounded-full sm:bg-[#9146ff] text-[#9146ff] sm:text-white"
        >로그인</a>
      </div>
      <div
        class="relative mt-6 sm:mt-3 w-full max-w-xs rounded-3xl border bg-white p-6 sm:shadow-xl"
        :class="{ hidden: !modal }"
      >
        <div class="mb-6 flex items-center justify-between">
          <div>지금 방송 중</div>
          <button @click="modal = !modal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="text-xl font-semibold line-clamp-2">
          {{ streamInfo?.title }}
        </div>
        <div class="mb-2 line-clamp-1">
          {{ streamInfo?.game_name }}
        </div>
        <div>{{ dayjs().locale("ko").to(dayjs(streamInfo?.started_at)) }}</div>
        <div class="flex">
          <a
            href="/extension"
            class="mt-4 w-full cursor-pointer rounded-2xl bg-blue-100 p-3 text-center text-base no-underline transition-all duration-300 hover:shadow-lg hover:shadow-blue-400"
          >클립 만들기
          </a>
        </div>
        <div class="flex">
          <a
            href="https://twitch.tv/naseongkim"
            target="_blank"
            class="mt-2 w-full cursor-pointer rounded-2xl bg-blue-100 p-3 text-center text-base no-underline transition-all duration-300 hover:shadow-lg hover:shadow-blue-400"
          >방송 바로가기
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
