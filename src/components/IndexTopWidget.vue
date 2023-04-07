<script setup lang="ts">
import StreamStauts from './StreamStatus.vue';
</script>
<template>
  <div class="mb-12 flex w-full gap-6 lg:mb-8 lg:h-36">
    <StreamStauts />
    <div
      class="flex w-full flex-col overflow-hidden lg:rounded-3xl lg:border lg:bg-slate-50 lg:p-6"
    >
      <div
        class="mb-4 flex items-center gap-3 text-2xl font-bold lg:text-xl lg:font-semibold"
      >
        바로가기
      </div>
      <div class="flex h-full w-full gap-3 overflow-auto text-sm sm:text-base">
        <a
          href="/get"
          target="_blank"
          class="flex shrink-0 cursor-pointer items-center justify-center rounded-3xl bg-blue-500 px-4 py-2 text-white no-underline transition-all duration-300 hover:shadow-lg md:hover:shadow-blue-400 lg:mr-3 lg:px-6 lg:py-0"
        >
          클립 만들기
        </a>
        <a
          href="https://twitch.tv/naseongkim"
          target="_blank"
          class="flex cursor-pointer items-center justify-center rounded-3xl bg-purple-500 px-4 py-2 text-white no-underline transition-all duration-300 hover:shadow-lg md:hover:shadow-purple-400 lg:px-6 lg:py-0"
        >
          트위치
        </a>
        <a
          href="https://tgd.kr/s/naseongkim"
          target="_blank"
          class="flex cursor-pointer items-center justify-center rounded-3xl bg-purple-500 px-4 py-2 text-white no-underline transition-all duration-300 hover:shadow-lg md:hover:shadow-purple-400 lg:mr-3 lg:px-6 lg:py-0"
        >
          트게더
        </a>
        <a
          href="https://www.youtube.com/@Naseongkim"
          target="_blank"
          class="hover:shadow-oragne-400 flex cursor-pointer items-center justify-center rounded-3xl bg-orange-500 px-4 py-2 text-white no-underline transition-all duration-300 hover:shadow-lg md:hover:shadow-orange-400 lg:px-6 lg:py-0"
        >
          김나성
        </a>
        <a
          href="https://www.youtube.com/@ginnaseong"
          target="_blank"
          class="flex cursor-pointer items-center justify-center rounded-3xl bg-sky-500 px-4 py-2 text-white no-underline transition-all duration-300 hover:shadow-lg md:hover:shadow-sky-400 lg:px-6 lg:py-0"
        >
          긴나성
        </a>
        <a
          href="https://www.youtube.com/@Deepnaseong"
          target="_blank"
          class="flex cursor-pointer items-center justify-center rounded-3xl bg-slate-500 px-4 py-2 text-white no-underline transition-all duration-300 hover:shadow-lg md:hover:shadow-slate-400 lg:px-6 lg:py-0"
        >
          딥나성
        </a>
      </div>
    </div>
  </div>
</template>
