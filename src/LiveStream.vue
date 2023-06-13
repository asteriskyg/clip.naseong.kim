<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from './stores/auth';
import { useDark } from '@vueuse/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import Header from './components/layouts/HeaderLayout.vue';
import Footer from './components/layouts/FooterLayout.vue';
import RecentClipList from './components/RecentClipList.vue';
import CreateClip from './components/CreateClip.vue';
dayjs.extend(relativeTime);

const VITE_HOST = import.meta.env.VITE_HOST;
const store = useAuthStore();
const streamInfo = ref<typeof store.streamInfo>();
const banner = ref(true);
const cinema = ref(false);
const chat = ref(true);
const chatPopout = ref('');
const clipPopup = ref(false);

onMounted(async () => {
  streamInfo.value = await store.getStreamInfo();
  useDark().value
    ? chatPopout.value = `https://www.twitch.tv/embed/naseongkim/chat?darkpopout&parent=${VITE_HOST}`
    : chatPopout.value = `https://www.twitch.tv/embed/naseongkim/chat?parent=${VITE_HOST}`;
});

watch(useDark(), (newVal) => {
  newVal
    ? chatPopout.value = `https://www.twitch.tv/embed/naseongkim/chat?darkpopout&parent=${VITE_HOST}`
    : chatPopout.value = `https://www.twitch.tv/embed/naseongkim/chat?parent=${VITE_HOST}`;
});
</script>
<template>
  <Header
    v-if="!cinema"
    class="z-20"
  />
  <div
    class="relative flex flex-col lg:flex-row lg:justify-center h-[calc(100vh-165px)]"
    :class="{
      'lg:h-screen overflow-hidden': cinema,
      'lg:h-full': !cinema,
    }"
  >
    <div
      class="w-full z-10"
      :class="{
        'flex items-center bg-black': cinema,
        'max-w-7xl lg:border-l dark:border-neutral-600': !cinema,
        'lg:border-r dark:border-neutral-600': !chat && !cinema
      }"
    >
      <div
        class="aspect-video border-b dark:border-neutral-600"
        :class="{
          'w-full max-h-screen m-auto': cinema,
          'w-full': !cinema,
        }"
      >
        <iframe
          src="https://player.twitch.tv/?channel=naseongkim&parent=naseong.kim&darkpopout"
          frameborder="0"
          width="100%"
          height="100%"
          allowfullscreen
        />
      </div>
      <div
        :class="{
          'hidden': cinema,
          'block': !cinema,
        }"
      >
        <div
          v-if="streamInfo && streamInfo?.status !== 'offline'"
          class="relative z-10 flex flex-col p-4 lg:p-6 border-b bg-white dark:bg-twitch-dark dark:border-neutral-600"
        >
          <div class="text-xl lg:text-2xl mb-1 lg:mb-0 line-clamp-1 text-black dark:text-slate-200">
            {{ streamInfo.title }}
          </div>
          <div class="lg:text-lg lg:mb-2 line-clamp-1 text-black dark:text-slate-200">
            {{ streamInfo.game_name }}
          </div>
          <div class="hidden lg:block text-base text-black dark:text-slate-200">
            {{ dayjs().locale("ko").to(dayjs(streamInfo?.started_at)) }}
          </div>
        </div>
        <div class="hidden lg:block p-6">
          <RecentClipList
            title="최근 만들어진 클립"
            get="recent"
          />
        </div>
      </div>
      <div
        class="flex z-10 w-full justify-center lg:justify-end items-center px-3 h-14 bg-slate-50 dark:bg-neutral-800 border-t dark:border-neutral-600 transition-all"
        :class="{
          'translate-y-full': !banner,
          'absolute bottom-0': cinema,
          'fixed lg:sticky bottom-0': !cinema,
        }"
      >
        <button
          class="absolute top-0 w-10 h-8 bg-slate-50 dark:bg-neutral-800 rounded-t-lg border border-b-0 dark:border-neutral-600 -translate-y-full transition-opacity"
          :class="{
            'opacity-100': banner,
            'opacity-50 hover:opacity-100': !banner,
          }"
          @click="banner = !banner"
        >
          <i
            class="xi-2x text-black dark:text-slate-200"
            :class="{'xi-angle-down-min': banner, 'xi-angle-up-min': !banner}"
          />
        </button>
        <a
          href="https://twitch.tv/naseongkim"
          class="w-10 h-10 flex justify-center items-center text-twitch-purple hover: dark:text-slate-200 hover:bg-violet-100 hover:dark:bg-violet-800 rounded-xl"
        >
          <i class="xi-x xi-twitch" />
        </a>
        <div>
          <button
            class="w-10 h-10 flex justify-center text-blue-500 hover: dark:text-slate-200 items-center hover:bg-blue-100 hover:dark:bg-blue-900 rounded-xl"
            @click="clipPopup = !clipPopup"
          >
            <i class="xi-x xi-scissors" />
          </button>
          <div
            v-if="clipPopup"
            class="absolute bottom-0 left-0 sm:left-1/2 sm:-translate-x-1/2 lg:translate-x-0 lg:left-auto lg:bottom-16 lg:right-2 sm:max-w-sm w-full bg-slate-100 dark:bg-neutral-800 rounded-3xl border dark:border-neutral-600 lg:shadow-xl"
          >
            <CreateClip />
            <button
              class="absolute top-6 right-6"
              @click="clipPopup = !clipPopup"
            >
              <i class="xi-x xi-close text-black dark:text-slate-200" />
            </button>
          </div>
        </div>
        <button
          class="hidden lg:flex w-10 h-10 justify-center items-center text-black dark:text-slate-200 hover:bg-slate-200 hover:dark:bg-slate-600 rounded-xl"
          @click="chat = !chat"
        >
          <i
            v-if="!chat"
            class="xi-x xi-fw xi-comment-o"
          />
          <i
            v-else
            class="xi-x xi-fw xi-comment"
          />
        </button>
        <button
          class="hidden lg:flex w-10 h-10 justify-center items-center text-black dark:text-slate-200 hover:bg-slate-200 hover:dark:bg-slate-600 rounded-xl"
          @click="cinema = !cinema"
        >
          <i
            v-if="!cinema"
            class="xi-x xi-fw xi-layout xi-rotate-90"
          />
          <i
            v-else
            class="xi-x xi-fw xi-layout-aside"
          />
        </button>
      </div>
      <Footer
        :class="{
          'hidden': cinema,
          'hidden lg:block': !cinema,
        }"
      />
    </div>
    <div
      class="lg:sticky w-full h-full lg:max-w-sm dark:border-neutral-600"
      :class="{
        'lg:h-screen lg:top-0 border-l': cinema,
        'lg:h-[calc(100vh-56px)] lg:top-[56px] lg:border-x': !cinema,
        'block': chat,
        'hidden': !chat,
      }"
    >
      <iframe
        :src="chatPopout"
        frameborder="0"
        width="100%"
        height="100%"
      />
    </div>
  </div>
</template>
