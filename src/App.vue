<script setup lang="ts">
import Header from './components/layouts/Header.vue'
import Footer from './components/layouts/Footer.vue'
</script>
<template>
  <div class="min-w-full min-h-full">
    <Header/>
    <router-view class="h-full"></router-view>
    <Footer/>
  </div>
</template>
