<template>
  <div class="sticky w-full top-0 bg-gray-100/50 backdrop-blur-lg border-b z-10">
    <div class="w-full px-6 py-6 max-w-7xl m-auto">
      <div class="flex justify-between items-center">
        <div class="flex gap-6 items-center">
          <a href="/" class="flex text-3xl">
            <div>naseong.kim</div>
          </a>
          <button v-if="streamInfo" @click="toggleLive" class="text-sm px-4 py-1 bg-red-500 shadow-lg shadow-red-600 text-white rounded-full select-none">LIVE</button>
          <!-- <div id="autocomplete" class="hidden"></div> -->
        </div>
        <div v-if="me">
          <Menu>
            <div class="relative w-10 h-10">
              <MenuButton>
                <img :src="me.profileImageUrl" class="w-10 h-10 rounded-full border" alt="" />
              </MenuButton>
              <MenuItems class="w-48 flex flex-col absolute bg-white border rounded-xl right-0 overflow-hidden shadow-2xl">
                <div class="px-4 pt-3 pb-2 border-b">
                  <div class="text-sm">로그인 된 계정</div>
                  <div class="text-lg font-semibold">{{ me.displayName }}</div>
                </div>
                <div class="px-4 py-2 bg-slate-100 text-slate-500 border-b">
                  <div>바로가기</div>
                </div>
                <MenuItem v-slot="{ active }">
                  <a href="https://tgd.kr/s/naseongkim" target="_blank" class="transition-all duration-300 px-5 py-3 text-left text-[#6441A5]" :class='{ "bg-[#6441A5]/20": active }'>
                    트게더
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a href="https://www.twitch.tv/naseongkim" target="_blank" class="transition-all duration-300 px-5 py-3 text-left text-[#9146ff]" :class='{ "bg-[#9146ff]/20": active }'>
                    트위치
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a href="https://www.youtube.com/@Naseongkim" target="_blank" class="transition-all duration-300 px-5 py-3 text-left border-b text-[#FF0000]" :class='{ "bg-[#FF0000]/20": active }'>
                    유튜브
                  </a>
                </MenuItem>
                <div class="px-4 py-2 bg-slate-100 text-slate-500 border-b">
                  <div>설정</div>
                </div>
                <MenuItem v-slot="{ active }">
                  <button @click="logout" class="transition-all duration-300 px-5 py-3 text-left" :class='{ "bg-blue-100": active }'>
                    로그아웃
                  </button>
                </MenuItem>
              </MenuItems>
            </div>
          </Menu>
        </div>
        <a
          v-if="!loginStatus && router.currentRoute.value.path !== '/authorization'"
          :href="`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=0373yf8vzqpo4f9ln4ajqrq9fim3hd&redirect_uri=${VITE_HOST_URL}/authorization&scope=clips%3Aedit%20user%3Aread%3Aemail`"
          class="py-2 px-4 rounded-full text-white bg-[#9146ff]"
          >로그인</a
        >
      </div>
      <div class="relative w-full max-w-sm bg-white rounded-3xl border mt-6 p-6" :class="{'hidden' : !modal}">
        <div class="flex justify-between items-center mb-6">
          <div>지금 방송 중</div>
          <button @click="toggleLive">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="text-xl font-semibold line-clamp-2">{{ streamInfo?.title }}</div>
        <div class="mb-2 line-clamp-1">{{ streamInfo?.game_name }}</div>
        <div>{{ dayjs().locale('ko').to(dayjs(streamInfo?.started_at)) }}</div>
        <div class="flex">
          <a href="https://twitch.tv/naseongkim" target="_blank" id="broadcast-button" class="w-full text-base bg-blue-100 mt-4 p-3 rounded-2xl text-center cursor-pointer transition-all no-underline duration-300 hover:shadow-lg hover:shadow-blue-400">방송 바로가기
          </a>
        </div>
        <div class="absolute top-6 right-6">

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { router } from '../../router';
import axios from 'axios';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface Me {
  displayName: string;
  email: string;
  profileImageUrl: string;
  twitchUserId: number;
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

const auth = useAuthStore()
const loginStatus = ref(true);
const me = ref<Me>();
const modal = ref(false);
const streamInfo = ref<StreamInfo>();

onMounted(async () => {
  const authority = await auth.checkAuthority();

  if (!authority) {
    return loginStatus.value = false;
  }

  const whoami = await auth.whoami();
  me.value = whoami;

  const getStreamInfo = await auth.getStreamInfo();
  streamInfo.value = getStreamInfo;
});

function toggleLive() {
  modal.value = !modal.value;
}

async function logout() {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  await axios.get(`${VITE_API_URL}/logout`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      refresh: refreshToken
    }
  });

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');

  window.location.reload();
}
</script>
