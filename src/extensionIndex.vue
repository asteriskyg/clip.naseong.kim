<script setup lang="ts">
import { onMounted } from 'vue';
import ExtensionHeader from './components/Extension/layouts/ExtensionHeader.vue';
import ExtensionAd from './components/Extension/layouts/ExtensionAd.vue';
import ExtensionBookmark from './components/ExtensionBookmark.vue';
import ExCard from './components/ExCard.vue';
import CreateClip from './components/CreateClip.vue';

const VITE_HOST_URL = import.meta.env.VITE_HOST_URL;

onMounted(async () => {
  window.postMessage({ status: 'online' }, VITE_HOST_URL);
});
</script>
<template>
  <ExtensionHeader />
  <div class="flex flex-col m-auto max-w-sm p-6 gap-6">
    <ExtensionAd />
    <CreateClip />
    <ExCard
      icon="file-video-o"
      title="유튜브 다시보기에서 클립을 만들어 보세요."
      :button="{
        active: true,
        type: 'link',
        text: '바로가기',
        href: '/import',
        target: '_self'
      }"
      :color="{
        bg: 'slate',
        btn: 'red'
      }"
    />
    <div>
      <ExtensionBookmark />
    </div>
  </div>
</template>
