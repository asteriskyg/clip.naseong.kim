<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
  bg: {
    type: String,
    default: undefined,
  },
  text: {
    type: String,
    default: 'white',
  },
});

const bg = computed(() => {
  if (props.bg === 'red') {
    return 'bg-red-500 hover:bg-red-600 dark:bg-red-800/50 dark:hover:bg-red-800';
  } else if (props.bg === 'blue') {
    return 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-800/50 dark:hover:bg-blue-800';
  } else if (props.bg === 'green') {
    return 'bg-green-500 hover:bg-green-600 dark:bg-green-800/50 dark:hover:bg-green-800';
  } else if (props.bg === 'rose') {
    return 'bg-rose-500 hover:bg-rose-600 dark:bg-rose-800/50 dark:hover:bg-rose-800';
  } else if (props.bg === 'purple') {
    return 'bg-twitch-purple hover:bg-violet-600 dark:bg-violet-800/50 dark:hover:bg-violet-800';
  } else if (props.bg === 'pink') {
    return 'bg-pink-500 hover:bg-pink-600 dark:bg-pink-800/50 dark:hover:bg-pink-800';
  } else if (props.bg === 'sky') {
    return 'bg-sky-500 hover:bg-sky-600 dark:bg-sky-800/50 dark:hover:bg-sky-800';
  } else if (props.bg === 'orange') {
    return 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-800/50 dark:hover:bg-orange-800';
  } else if (props.bg === 'slate') {
    return 'bg-slate-500 hover:bg-slate-600 dark:bg-slate-800/50 dark:hover:bg-slate-800';
  } else {
    return 'bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800/50 dark:hover:bg-neutral-800 dark:text-slate-200';
  }
});

const text = computed(() => {
  if (props.text === 'white') {
    return 'text-white dark:text-slate-200';
  } else {
    return 'text-black';
  }
});
</script>
<template>
  <a
    :href="props.href"
    target="_blank"
    class="flex h-32 w-1/2 cursor-pointer flex-col items-start justify-between rounded-3xl p-5 transition-colors duration-300 ease-in-out"
    :class="`${bg} ${text}`"
  >
    <i
      class="icon xi-2x"
      :class="`xi-${props.icon}`"
    />
    <span>
      {{ props.title }}
    </span>
  </a>
</template>
