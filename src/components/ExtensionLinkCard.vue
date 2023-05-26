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
    return 'bg-red-500 hover:shadow-red-300';
  } else if (props.bg === 'blue') {
    return 'bg-blue-500 hover:shadow-blue-300';
  } else if (props.bg === 'green') {
    return 'bg-green-500 hover:shadow-green-400';
  } else if (props.bg === 'rose') {
    return 'bg-rose-500 hover:shadow-rose-400';
  } else if (props.bg === 'purple') {
    return 'bg-twitch-purple hover:shadow-violet-400';
  } else if (props.bg === 'pink') {
    return 'bg-pink-500 hover:shadow-pink-400';
  } else if (props.bg === 'sky') {
    return 'bg-sky-500 hover:shadow-sky-400';
  } else if (props.bg === 'orange') {
    return 'bg-orange-500 hover:shadow-orange-400';
  } else if (props.bg === 'slate') {
    return 'bg-slate-500 hover:shadow-slate-400';
  } else {
    return 'bg-slate-200';
  }
});

const text = computed(() => {
  if (props.text === 'white') {
    return 'text-white';
  } else {
    return 'text-black';
  }
});
</script>
<template>
  <a
    :href="props.href"
    target="_blank"
    class="flex h-32 w-1/2 cursor-pointer flex-col items-start justify-between rounded-3xl p-5 transition-all duration-300 hover:shadow-lg"
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
