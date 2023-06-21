<script setup lang="ts">
import ExtensionHeader from './components/Extension/layouts/ExtensionHeader.vue';
import ExtensionAd from './components/Extension/layouts/ExtensionAd.vue';
import ExtensionBookmark from './components/ExtensionBookmark.vue';
import ExCard from './components/ExCard.vue';
import CreateClip from './components/CreateClip.vue';
</script>
<template>
  <ExtensionHeader />
  <div class="flex flex-col m-auto max-w-sm p-6 gap-6">
    <ExtensionAd />
    <CreateClip />
    <ExCard
      icon="file-video-o"
      title="유튜브 다시보기에서 클립을 만들어 보세요."
      :button="{
        active: true,
        type: 'link',
        text: '바로가기',
        href: '/import',
        target: '_self'
      }"
      :color="{
        bg: 'slate',
        btn: 'red'
      }"
    />
    <ExCard
      icon="help-o"
      title="사용하는데 문제가 있나요?"
      :button="{
        active: true,
        type: 'link',
        text: '버그 제보하기',
        href: 'https://naseongkim.channel.io',
        target: '_blank'
      }"
      :color="{
        bg: 'slate',
        btn: 'purple'
      }"
    >
      <div class="overflow-hidden text-lg text-black dark:text-slate-200 mb-6">
        내용을 알려주시면 빠르게 해결해드릴게요.
      </div>
    </ExCard>
    <div>
      <ExtensionBookmark />
    </div>
  </div>
</template>
