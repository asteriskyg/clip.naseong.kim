<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: undefined,
  },
  subtitle: {
    type: String,
    default: undefined,
  },
  button: {
    type: Object,
    default() {
      return {
        disabled: false,
        active: false,
        type: undefined,
        text: undefined,
        href: undefined,
        click: undefined,
      };
    },
  },
  color: {
    type: Object,
    default() {
      return {
        bg: 'slate',
        btn: 'slate',
      };
    },
  },
});

const bgColor = computed(() => {
  if (props.color.bg === 'slate') {
    return 'bg-slate-100 dark:bg-neutral-800';
  } else if (props.color.bg === 'red') {
    return 'bg-red-100 dark:bg-red-900/50';
  } else if (props.color.bg === 'blue') {
    return 'bg-blue-100 dark:bg-blue-900/50';
  } else if (props.color.bg === 'green') {
    return 'bg-green-100 dark:bg-green-900/50';
  } else if (props.color.bg === 'orange') {
    return 'bg-orange-100 dark:bg-orange-900/50';
  } else {
    return '';
  }
});

const btnColor = computed(() => {
  if (props.color.btn === 'slate') {
    return 'bg-slate-200 dark:bg-neutral-700 hover:bg-slate-300 dark:hover:bg-neutral-600 disabled:hover:bg-slate-600 text-black dark:text-slate-200';
  } else if (props.color.btn === 'red') {
    return 'bg-red-500 dark:bg-red-800/50 hover:bg-red-600 dark:hover:bg-red-800 disabled:hover:bg-red-800/50 text-white dark:text-slate-200';
  } else if (props.color.btn === 'blue') {
    return 'bg-blue-500 dark:bg-blue-800/50 hover:bg-blue-600 dark:hover:bg-blue-800 disabled:hover:bg-blue-800/50 text-white dark:text-slate-200';
  } else if (props.color.btn === 'green') {
    return 'bg-green-500 dark:bg-green-800/50 hover:bg-green-600 dark:hover:bg-green-800 disabled:hover:bg-green-800/50 text-white dark:text-slate-200';
  } else if (props.color.btn === 'orange') {
    return 'bg-orange-500 dark:bg-orange-800/50 hover:bg-orange-600 dark:hover:bg-orange-800 disabled:hover:bg-orange-800/50 text-white dark:text-slate-200';
  } else if (props.color.btn === 'purple') {
    return 'bg-twitch-purple dark:bg-twitch-purple/50 hover:bg-violet-600 dark:hover:bg-violet-800 disabled:hover:bg-violet-800/50 text-white dark:text-slate-200';
  } else {
    return '';
  }
});
</script>
<template>
  <div
    class="flex flex-col rounded-3xl p-6"
    :class="bgColor"
  >
    <span
      class="icon text-black dark:text-slate-200"
      :class="`xi-${props.icon}`"
    />
    <div class="mb-2 overflow-hidden text-2xl line-clamp-2 text-black dark:text-slate-200">
      {{ props.title }}
    </div>
    <div class="overflow-hidden text-lg line-clamp-1 text-black dark:text-slate-200">
      {{ props.subtitle }}
    </div>
    <slot />
    <button
      v-if="props.button.active && props.button.type === 'button'"
      :disabled="props.button.disabled"
      class="mt-4 cursor-pointer rounded-3xl p-4 text-base no-underline transition-all duration-300 disabled:cursor-not-allowed"
      :class="btnColor"
      @click="props.button.click"
    >
      {{ props.button.text }}
    </button>
    <a
      v-if="props.button.active && props.button.type === 'link'"
      target="_blank"
      class="mt-5 cursor-pointer rounded-3xl p-4 text-center text-base no-underline transition-all duration-300"
      :class="btnColor"
      :href="props.button.href"
    >{{ props.button.text }}
    </a>
  </div>
</template>
