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
    return 'bg-slate-200';
  } else if (props.color.bg === 'red') {
    return 'bg-red-100';
  } else if (props.color.bg === 'blue') {
    return 'bg-blue-100';
  } else if (props.color.bg === 'green') {
    return 'bg-green-100';
  } else if (props.color.bg === 'orange') {
    return 'bg-orange-100';
  } else {
    return '';
  }
});

const btnColor = computed(() => {
  if (props.color.btn === 'slate') {
    return 'bg-slate-400 hover:bg-slate-500 disabled:hover:bg-slate-400 hover:shadow-slate-500 text-white';
  } else if (props.color.btn === 'red') {
    return 'bg-red-500 hover:bg-red-600 disabled:hover:bg-red-500 hover:shadow-red-500 text-white';
  } else if (props.color.btn === 'blue') {
    return 'bg-blue-500 hover:bg-blue-600 disabled:hover:bg-blue-500 hover:shadow-blue-500 text-white';
  } else if (props.color.btn === 'green') {
    return 'bg-green-500 hover:bg-green-600 disabled:hover:bg-green-500 hover:shadow-green-500 text-white';
  } else if (props.color.btn === 'orange') {
    return 'bg-orange-500 hover:bg-orange-600 disabled:hover:bg-orange-500 hover:shadow-orange-500 text-white';
  } else if (props.color.btn === 'purple') {
    return 'bg-purple-500 hover:bg-purple-600 disabled:hover:bg-purple-500 hover:shadow-purple-500 text-white';
  } else {
    return '';
  }
});
</script>
<template>
  <div
    class="flex flex-col rounded-3xl p-5"
    :class="bgColor"
  >
    <span
      class="icon"
      :class="`xi-${props.icon}`"
    />
    <div class="'mb-2 overflow-hidden text-2xl line-clamp-2'">
      {{ props.title }}
    </div>
    <div class="overflow-hidden text-lg line-clamp-1">
      {{ props.subtitle }}
    </div>
    <slot />
    <button
      v-if="props.button.active && props.button.type === 'button'"
      :disabled="props.button.disabled"
      class="mt-4 cursor-pointer rounded-3xl p-4 text-base no-underline transition-all duration-300 hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed"
      :class="btnColor"
      @click="props.button.click"
    >
      {{ props.button.text }}
    </button>
    <a
      v-if="props.button.active && props.button.type === 'link'"
      target="_blank"
      class="mt-5 cursor-pointer rounded-3xl p-4 text-center text-base no-underline transition-all duration-300 hover:shadow-lg"
      :class="btnColor"
      :href="props.button.href"
    >{{ props.button.text }}
    </a>
  </div>
</template>
