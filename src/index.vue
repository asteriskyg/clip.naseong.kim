<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="mx-auto mt-6 w-full max-w-7xl p-6">
    <div class="mb-4 text-2xl font-bold">
      최근 클립
    </div>
    <RecentClipList />
  </div>
</template>
<script setup lang="ts">
import RecentClipList from './components/RecentClipList.vue';
</script>
