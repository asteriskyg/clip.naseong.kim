<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useAuth } from '../plugins/useAuth';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import ExCard from './ExCard.vue';
dayjs.extend(relativeTime);

interface Clip {
  clipId: string;
  broadcastTitle: string;
  clipName: string;
}

const VITE_HOST_URL = import.meta.env.VITE_HOST_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const authStore = useAuthStore();
const auth = useAuth();
const me = ref<typeof authStore.me>();
const streamInfo = ref<typeof authStore.streamInfo>();
const status = ref('await');
const clip = ref<Clip>();

onMounted(async () => {
  window.postMessage({ status: 'online' }, VITE_HOST_URL);
  me.value = await authStore.whoami();
  if (!me.value) status.value = 'login';
  fetchStream();
});

const createClip = async () => {
  if (status.value === 'createError') {
    status.value = 'create';
    const createClip = await (await axios
      .get(`${VITE_API_URL}/clip/create`)
      .catch(async () => {
        await auth.refreshAuthority();
        return await axios.get(`${VITE_API_URL}/clip/create`);
      })
    ).data;

    if (!createClip) {
      status.value = 'createFailed';
      return false;
    }
  }

  status.value = 'create';
  const createClip = await (await axios
    .get(`${VITE_API_URL}/clip/create`)
    .catch(async () => {
      await auth.refreshAuthority();
      return await axios.get(`${VITE_API_URL}/clip/create`);
    })
  ).data;

  if (!createClip) {
    status.value = 'createError';
    return false;
  }

  clip.value = createClip;
  status.value = 'success';
};

const fetchStream = async () => {
  streamInfo.value = await authStore.getStreamInfo();
};
</script>
<template>
  <ExCard
    v-if="!streamInfo"
    icon="twitch"
    title="방송 정보를 불러오고 있어요."
    subtitle="잠시만 기다려 주세요."
  />
  <ExCard
    v-if="streamInfo?.status === 'offline'"
    icon="night"
    title="오프라인"
  />
  <ExCard
    v-if="streamInfo?.status === 'online' && status === 'await'"
    icon="play-circle-o"
    :title="streamInfo?.title || '방송 제목'"
    :subtitle="streamInfo?.game_name || '게임 이름'"
    :button="{
      active: true,
      type: 'button',
      text: '클립 만들기',
      click: createClip,
    }"
    :color="{
      bg: 'blue',
      btn: 'blue'
    }"
  >
    <span class="text-black dark:text-slate-200">{{ dayjs().locale("ko").to(dayjs(streamInfo?.started_at)) }}</span>
    <a
      href="/live"
      target="_blank"
      class="mt-4 -mb-1 w-full text-center text-slate-500 dark:text-neutral-300 font-semibold underline underline-offset-4 hover:text-blue-500 dark:hover:text-blue-500"
    >방송 보러가기</a>
  </ExCard>
  <ExCard
    v-if="streamInfo?.status === 'online' && status === 'login'"
    icon="play-circle-o"
    :title="streamInfo?.title || '방송 제목'"
    :subtitle="streamInfo?.game_name || '게임 이름'"
    :button="{
      active: true,
      type: 'link',
      text: '로그인 하고 클립 만들기',
      href: `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=0373yf8vzqpo4f9ln4ajqrq9fim3hd&redirect_uri=${VITE_HOST_URL}/authorization&scope=clips%3Aedit%20user%3Aread%3Aemail%20user%3Aread%3Asubscriptions`,
    }"
    :color="{
      bg: 'slate',
      btn: 'purple',
    }"
  >
    <span class="text-black dark:text-slate-200">{{ dayjs().locale("ko").to(dayjs(streamInfo?.started_at)) }}</span>
    <a
      href="https://twitch.tv/naseongkim"
      target="_blank"
      class="mt-4 -mb-1 w-full text-center text-slate-600 font-semibold underline underline-offset-4 hover:text-blue-500"
    >방송 보러가기</a>
  </ExCard>
  <ExCard
    v-if="status === 'create'"
    icon="cut"
    title="클립을 만들고 있어요."
    subtitle="잠시만 기다려 주세요."
    :color="{
      bg: 'blue',
      btn: 'blue'
    }"
  />
  <ExCard
    v-if="status === 'success'"
    icon="check-circle-o"
    title="클립을 만들었어요."
    :button="{
      active: true,
      type: 'link',
      text: '클립 보러가기',
      href: `${VITE_HOST_URL}/detail/${clip?.clipName}`,
    }"
    :color="{
      bg: 'green',
      btn: 'green'
    }"
  />
  <ExCard
    v-if="status === 'createError'"
    icon="error-o"
    title="클립을 만드는 중 오류가 발생했어요."
    :button="{
      active: true,
      type: 'button',
      text: '다시 만들기',
      click: createClip,
    }"
    :color="{
      bg: 'orange',
      btn: 'orange'
    }"
  />
  <ExCard
    v-if="status === 'createFailed'"
    icon="close-circle-o"
    title="클립을 만들 수 없어요. 나중에 다시 시도해 주세요."
    :color="{
      bg: 'red',
      btn: 'red'
    }"
  />
  <ExCard
    v-if="streamInfo?.status === 'unknown'"
    icon="error-o"
    title="방송 정보를 불러올 수 없어요."
    :button="{
      active: true,
      type: 'button',
      text: '다시 확인하기',
      click: fetchStream,
    }"
    :color="{
      bg: 'orange',
      btn: 'orange'
    }"
  />
</template>
