<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import IndexTopWidget from './components/IndexTopWidget.vue';
import RecentClipList from './components/RecentClipList.vue';
</script>
<template>
  <div class="mx-auto w-full max-w-7xl p-6 lg:mt-6">
    <IndexTopWidget />
    <RecentClipList
      :title="'최근 클립'"
      :get="'recent'"
    />
  </div>
</template>
