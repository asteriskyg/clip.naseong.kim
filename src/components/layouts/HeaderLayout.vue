<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useAuth } from '../../plugins/useAuth';
import axios from 'axios';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRoute } from 'vue-router';
import ToggleDark from '../ToggleDark.vue';
dayjs.extend(relativeTime);

const VITE_HOST_URL = import.meta.env.VITE_HOST_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const route = useRoute();
const store = useAuthStore();
const auth = useAuth();
const loginStatus = ref(true);
const me = ref<typeof store.me>();
const streamInfo = ref<typeof store.streamInfo>();
const modal = ref(false);

onMounted(async () => {
  if (route.path === '/authorization') return;
  streamInfo.value = await store.getStreamInfo();
  me.value = await store.whoami();
  me.value ? (loginStatus.value = true) : (loginStatus.value = false);
});

async function logout() {
  await axios
    .get(`${VITE_API_URL}/auth/logout`)
    .catch(async () => {
      await auth.refreshAuthority();
      return await axios.get(`${VITE_API_URL}/auth/logout`);
    });

  localStorage.removeItem('me');
  window.location.href = route.path;
}
</script>
<template>
  <div
    class="sticky top-0 z-30 w-full border-b dark:border-neutral-600 bg-slate-50/90 dark:bg-twitch-dark/90 backdrop-blur-lg"
  >
    <div
      class="max-w-7xl m-auto flex h-14 w-full items-center justify-center px-6"
    >
      <div class="flex w-full items-center justify-between">
        <div class="flex items-center gap-4">
          <a
            href="/"
            class="text-2xl text-black dark:text-slate-200"
          >na.<b>clip</b></a>
          <a
            v-if="streamInfo?.status === 'online'"
            href="/live"
            target="_blank"
            class="select-none rounded-full bg-red-500 dark:bg-red-800 px-4 py-1 text-sm text-white shadow-lg shadow-red-600 dark:shadow-red-800"
          >
            LIVE
          </a>
        </div>
        <div class="flex items-center gap-6">
          <ToggleDark />
          <div v-if="me">
            <Menu>
              <div class="relative h-8 w-8">
                <MenuButton>
                  <img
                    :src="me.profileImageUrl"
                    class="rounded-full border dark:border-neutral-600"
                    alt=""
                  >
                </MenuButton>
                <MenuItems
                  class="absolute right-0 z-10 flex w-48 flex-col overflow-hidden rounded-xl border dark:border-neutral-600 bg-white dark:bg-twitch-dark shadow-2xl"
                >
                  <div class="px-4 pb-2 pt-3 text-black  dark:text-slate-200">
                    <div class="text-sm">
                      로그인 된 계정
                    </div>
                    <div class="text-lg font-semibold">
                      {{ me.displayName }}
                    </div>
                  </div>
                  <div class="border-y dark:border-neutral-600 bg-slate-100 dark:bg-neutral-800 px-4 py-2 text-slate-500  dark:text-slate-200">
                    <div>바로가기</div>
                  </div>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="https://tgd.kr/s/naseongkim"
                      target="_blank"
                      class="px-5 py-3 text-left text-[#6441A5]"
                      :class="{ 'bg-[#6441A5]/20': active }"
                    >
                      트게더
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="https://www.twitch.tv/naseongkim"
                      target="_blank"
                      class="px-5 py-3 text-left text-[#9146ff]"
                      :class="{ 'bg-[#9146ff]/20': active }"
                    >
                      트위치
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="https://www.youtube.com/@Naseongkim"
                      target="_blank"
                      class="px-5 py-3 text-left text-[#FF0000]"
                      :class="{ 'bg-[#FF0000]/20': active }"
                    >
                      유튜브
                    </a>
                  </MenuItem>
                  <div class="border-y dark:border-neutral-600 bg-slate-100 dark:bg-neutral-800 px-4 py-2 text-slate-500  dark:text-slate-200">
                    <div>설정</div>
                  </div>
                  <MenuItem v-slot="{ active }">
                    <a
                      :href="`/profile/${me.twitchUserId}`"
                      class="px-5 py-3 text-left text-black  dark:text-slate-200"
                      :class="{ 'bg-slate-100 dark:bg-neutral-800': active }"
                    >
                      내 프로필
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      class="px-5 py-3 text-left text-black  dark:text-slate-200"
                      :class="{ 'bg-slate-100 dark:bg-neutral-800': active }"
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
            class="text-md text-twitch-purple sm:rounded-full sm:bg-[#9146ff] sm:px-4 sm:py-2 sm:text-white"
          >로그인</a>
        </div>
      </div>
      <div
        class="absolute left-6 top-8 mt-6 w-full max-w-xs rounded-3xl border bg-white p-6 sm:top-16 sm:mt-3 sm:shadow-xl"
        :class="{ hidden: !modal }"
      >
        <div class="mb-6 flex items-center justify-between">
          <div>지금 방송 중</div>
          <button @click="modal = !modal">
            <i class="xi-x xi-close" />
          </button>
        </div>
        <div class="line-clamp-2 text-xl font-semibold">
          {{ streamInfo?.title }}
        </div>
        <div class="mb-2 line-clamp-1">
          {{ streamInfo?.game_name }}
        </div>
        <div>{{ dayjs().locale("ko").to(dayjs(streamInfo?.started_at)) }}</div>
        <div class="flex">
          <a
            href="/extension"
            class="mt-4 w-full cursor-pointer rounded-2xl bg-blue-100 p-3 text-center text-base no-underline transition-colors duration-300 hover:shadow-lg hover:shadow-blue-400"
          >클립 만들기
          </a>
        </div>
        <div class="flex">
          <a
            href="https://twitch.tv/naseongkim"
            target="_blank"
            class="mt-2 w-full cursor-pointer rounded-2xl bg-blue-100 p-3 text-center text-base no-underline transition-colors duration-300 hover:shadow-lg hover:shadow-blue-400"
          >방송 바로가기
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
