<script setup lang="ts">
import ExtensionLinkCard from './ExtensionLinkCard.vue';

</script>
<template>
  <div class="mb-1 text-lg text-black dark:text-slate-200">
    바로가기
  </div>
  <div class="flex gap-3">
    <ExtensionLinkCard
      title="방송 후원하기"
      bg="rose"
      icon="heart"
      href="https://app.twip.kr/donate/naseongkim"
    />
    <ExtensionLinkCard
      title="트게더"
      bg="purple"
      icon="speech"
      href="https://tgd.kr/s/naseongkim"
    />
  </div>
  <div class="mt-4 mb-1 text-lg text-black dark:text-slate-200">
    유튜브
  </div>
  <div class="mb-3 flex gap-3">
    <ExtensionLinkCard
      title="김나성"
      bg="orange"
      icon="play-circle-o"
      href="https://www.youtube.com/@Naseongkim"
    />
    <ExtensionLinkCard
      title="긴나성"
      bg="sky"
      icon="snooze"
      href="https://www.youtube.com/channel/UCxbWbdvNz3VCTVumDIc0XrA"
    />
  </div>
  <div class="flex gap-3">
    <ExtensionLinkCard
      title="딥나성"
      bg="slate"
      icon="fast-forward"
      href="https://www.youtube.com/channel/UCfLvxrf3KoKpUG0bBHIZJ-g"
    />
    <div class="h-32 w-1/2 rounded-3xl bg-slate-100 dark:bg-neutral-800" />
  </div>
  <div class="mt-4 mb-1 text-lg text-black dark:text-slate-200">
    다른 링크
  </div>
  <div class="mb-3 flex gap-3">
    <ExtensionLinkCard
      title="!일정"
      bg="red"
      icon="calendar"
      href="https://bit.ly/3QeyGNd"
    />
    <ExtensionLinkCard
      title="!과금"
      bg="green"
      icon="truck"
      href="https://bit.ly/2N1X9Gp"
    />
  </div>
  <div class="flex gap-3">
    <ExtensionLinkCard
      title="!명령어"
      bg="pink"
      icon="scissors"
      href="https://ssakdook.twip.kr/command/naseongkim"
    />
    <ExtensionLinkCard
      title="출입금지"
      text="black"
      icon="ban"
      href="https://bit.ly/3QeyGNd"
    />
  </div>
</template>
