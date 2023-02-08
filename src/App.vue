<script setup lang="ts">
import Header from './components/layouts/HeaderLayout.vue';
import Footer from './components/layouts/FooterLayout.vue';
import './components/ChannelTalk.js';
</script>
<template>
  <div class="min-h-full min-w-full">
    <Header />
    <router-view class="h-full" />
    <Footer />
  </div>
</template>
