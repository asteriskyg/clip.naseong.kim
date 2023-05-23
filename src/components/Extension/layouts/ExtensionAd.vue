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
    class="hidden flex-col items-center gap-2 border-b bg-slate-50/30 p-5"
    :class="{'md:flex': banner}"
  >
    <div class="flex flex-col flex-wrap items-center justify-center gap-3 text-center">
      <div>확장프로그램으로 더 편리하게 이용해 보세요.</div>
      <div class="flex w-full gap-3 text-sm">
        <a
          target="_blank"
          href="https://chrome.google.com/webstore/detail/pccdeccoompikgkmcepmnmlggefjilfm"
          class="w-1/2 text-center rounded-2xl bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600"
        >
          다운받기
        </a>
        <button
          href="https://chrome.google.com/webstore/detail/pccdeccoompikgkmcepmnmlggefjilfm"
          class="w-1/2 text-center rounded-2xl bg-slate-200 p-3 text-slate-400 transition-colors hover:bg-slate-300 hover:text-slate-500"
          @click="hide"
        >
          7일간 보지 않기
        </button>
      </div>
    </div>
  </div>
</template>
