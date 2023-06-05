<script setup lang="ts">
import { ref, onMounted } from 'vue';

const banner = ref(true);

onMounted(() => {
  const local = localStorage.getItem('banner');
  if (!local) localStorage.setItem('banner', '');
  if (Date.now() < Number(local)) banner.value = false;
});

const hide = () => {
  localStorage.setItem('banner', (Date.now() + (1000 * 60 * 60 * 24 * 7)).toString());
  banner.value = false;
};
</script>
<template>
  <div
    class="flex-col rounded-3xl hidden selection:items-center bg-slate-200 dark:bg-neutral-800 p-6"
    :class="{'md:flex': banner}"
  >
    <span class="icon xi-lightbulb-o" />
    <div class="mb-6 overflow-hidden text-xl line-clamp-2">
      나클립 확장 프로그램으로 더욱 편리하게 이용해 보세요.
    </div>
    <div class="flex w-full gap-3 text-sm">
      <a
        target="_blank"
        href="https://chrome.google.com/webstore/detail/pccdeccoompikgkmcepmnmlggefjilfm"
        class="w-1/2 text-center rounded-2xl bg-blue-500 p-4 text-white transition-colors hover:bg-blue-600"
      >
        다운로드
      </a>
      <button
        class="w-1/2 text-center rounded-2xl bg-slate-300 p-4 text-slate-500 transition-colors hover:bg-slate-400 hover:text-white"
        @click="hide"
      >
        7일간 보지 않기
      </button>
    </div>
  </div>
</template>
