<script setup lang="ts">
import Header from './components/layouts/HeaderLayout.vue';
import Footer from './components/layouts/FooterLayout.vue';
import './components/ChannelTalk.js';
import { computed } from 'vue';
import axios from 'axios';

const isExtension = computed(() => {
  if (window.location.pathname === '/extension' || window.location.pathname === '/get') {
    return true;
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-undef
    ChannelIO('boot', {
      pluginKey: '02450e74-074b-4597-bb95-a9aa42f7f5d2',
    });
    return false;
  }
});

axios.get('https://naseong.kim/get');
</script>
<template>
  <div class="min-h-full min-w-full">
    <Header :class="{'hidden': isExtension}" />
    <div class="h-full">
      <router-view />
    </div>
    <Footer :class="{'hidden': isExtension}" />
  </div>
</template>
