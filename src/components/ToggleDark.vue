<script setup lang="ts">
import { UseDark } from '@vueuse/components';
</script>
<template>
  <UseDark v-slot="{ isDark, toggleDark }">
    <button @click="toggleDark()">
      <i
        class="aspect-square flex justify-center items-center xi-x text-black dark:text-slate-200 transition-all duration-300 ease-in-out"
        :class="{
          'xi-sun-o': isDark,
          'xi-night': !isDark,
        }"
      />
    </button>
  </UseDark>
</template>
