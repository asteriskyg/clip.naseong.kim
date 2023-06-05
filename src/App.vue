<script setup lang="ts">
import Header from './components/layouts/HeaderLayout.vue';
import Footer from './components/layouts/FooterLayout.vue';
import './components/ChannelTalk.js';
import { onMounted, computed, watch } from 'vue';
import { useDark } from '@vueuse/core';

const html = document.querySelector('html');

onMounted(() => {
  if (useDark().value) html?.classList.add('bg-twitch-dark');
});

watch(useDark(), (newVal) => {
  newVal
    ? html?.classList.add('bg-twitch-dark')
    : html?.classList.remove('bg-twitch-dark');
});

const isExtension = computed(() => {
  const path = location.pathname;
  if (path === '/extension' || path === '/get' || path === '/import' || path === '/live') return true;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line no-undef
  ChannelIO('boot', {
    pluginKey: '02450e74-074b-4597-bb95-a9aa42f7f5d2',
  });
  return false;
});
</script>
<template>
  <div class="bg-white dark:bg-twitch-dark">
    <Header :class="{'hidden': isExtension}" />
    <router-view />
    <Footer :class="{'hidden': isExtension}" />
  </div>
</template>
