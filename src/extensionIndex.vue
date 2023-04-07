<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from './stores/auth';
import { useAuth } from './plugins/useAuth';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import ExtensionHeader from './components/Extension/layouts/ExtensionHeader.vue';
import ExtensionAd from './components/Extension/layouts/ExtensionAd.vue';
dayjs.extend(relativeTime);

interface Me {
  displayName: string;
  email: string;
  profileImageUrl: string;
  profileBackgroundUrl: string;
  twitchUserId: number;
  userType: string;
  follow: Date | undefined;
  subscription: number | undefined;
}

interface StreamInfo {
  id: number;
  user_id: number;
  user_login: string;
  user_name: string;
  game_id: number;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: Date;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  tags: string[];
  is_mature: boolean;
}

interface Clip {
  clipId: string;
  broadcastTitle: string;
  clipName: string;
}

const VITE_HOST_URL = import.meta.env.VITE_HOST_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const authStore = useAuthStore();
const auth = useAuth();
const loginStatus = ref(true);
const me = ref<Me | undefined | null>();
const streamInfo = ref<StreamInfo | undefined>();
const status = ref('loading');
const clipName = ref('');
const tab = ref(false);
const clip = ref<Clip>();

onMounted(async () => {
  window.postMessage({ status: 'online' }, VITE_HOST_URL);
  me.value = await authStore.whoami();
  streamInfo.value = await authStore.getStreamInfo();

  if (!me.value) {
    loginStatus.value = false;
    status.value = 'login';
  }

  streamInfo.value
    ? (status.value = 'online')
    : streamInfo.value === undefined
      ? (status.value = 'offline')
      : (status.value = 'error');
});

const blockStatus = computed(() => {
  let icon;
  let title;
  let color;
  let button;
  let buttonText;

  if (status.value === 'loading') {
    icon = 'xi-twitch';
    title = '방송 정보를 불러오고 있어요.';
    color = 'slate';
  } else if (status.value === 'offline') {
    icon = 'xi-night';
    title = '오프라인';
    color = 'slate';
  } else if (status.value === 'online') {
    icon = 'xi-play-circle-o';
    title = streamInfo.value?.title;
    color = 'blue';
    button = true;
    buttonText = '방송 보러가기';
  } else if (status.value === 'create') {
    icon = 'xi-cut';
    title = '클립을 만들고 있어요.';
    color = 'slate';
    button = false;
  } else if (status.value === 'success') {
    icon = 'xi-check-circle-o';
    title = '클립을 만들었어요.';
    color = 'green';
    button = true;
    clipName.value
      ? (buttonText = '이름 바꾸기')
      : (buttonText = '클립 보러가기');
  } else if (status.value === 'edit') {
    icon = 'xi-check-circle-o';
    title = '이름 변경 완료!';
    color = 'green';
    button = true;
    buttonText = '클립 보러가기';
  } else if (status.value === 'editFailed') {
    icon = 'xi-error-o';
    title = '이름 변경 중 오류가 발생했어요.';
    color = 'red';
    button = true;
    buttonText = '다시 시도하기';
  } else if (status.value === 'criticalEdit') {
    icon = 'xi-error-o';
    title =
      '지금은 이름을 바꿀 수 없어요. 나클립 홈페이지에서 다시 시도해주세요.';
    color = 'red';
    button = true;
    buttonText = '클립 보러가기';
  } else if (status.value === 'createFailed') {
    icon = 'xi-error-o';
    title = '클립을 만드는 중 오류가 발생했어요.';
    color = 'red';
    button = true;
    buttonText = '다시 만들기';
  } else if (status.value === 'criticalCreate') {
    icon = 'xi-error-o';
    title = '지금은 클립을 만들 수 없어요. 나중에 다시 시도해주세요.';
    color = 'red';
    button = false;
  } else if (status.value === 'fetchFailed') {
    icon = 'xi-error-o';
    title = '방송 정보를 불러오지 못했어요.';
    color = 'red';
    button = true;
    buttonText = '다시 불러오기';
  } else if (status.value === 'criticalFetch') {
    icon = 'xi-error-o';
    title = '방송 정보를 불러올 수 없어요. 트위치에서 직접 확인해주세요.';
    color = 'red';
    button = true;
    buttonText = '트위치에서 확인하기';
  } else if (status.value === 'login') {
    icon = 'xi-error-o';
    title = '다시 로그인이 필요해요.';
    color = 'red';
    button = false;
  }

  return {
    icon,
    title,
    color,
    button,
    buttonText,
  };
});

function updateInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const updatedText = target.value;
  clipName.value = updatedText;
}

async function buttonAction() {
  if (status.value === 'online') {
    window.open('https://twitch.tv/naseongkim');
  } else if (status.value === 'success') {
    if (clipName.value) {
      const updateClipName = await (
        await axios.post(`${VITE_API_URL}/editClip`, {
          id: clip.value?.clipId,
          name: clipName.value,
        })
      ).data;

      if (!updateClipName) {
        status.value = 'editFailed';
        return;
      }

      status.value = 'edit';
    } else {
      window.open(`${VITE_HOST_URL}/detail/${clip.value?.clipName}`);
    }
  } else if (status.value === 'edit') {
    window.open(`${VITE_HOST_URL}/detail/${clip.value?.clipName}`);
  } else if (status.value === 'editFailed') {
    const updateClipName = await (
      await axios.post(`${VITE_API_URL}/editClip`, {
        id: clip.value?.clipId,
        name: clipName.value,
      })
    ).data;

    if (!updateClipName) {
      status.value = 'criticalEdit';
      return;
    }

    status.value = 'edit';
  } else if (status.value === 'fetchFailed') {
    status.value = 'loading';
    streamInfo.value = await authStore.getStreamInfo();
    streamInfo.value
      ? (status.value = 'online')
      : streamInfo.value === undefined
        ? (status.value = 'offline')
        : (status.value = 'criticalFetch');
  } else if (status.value === 'criticalFetch') {
    window.open('https://twitch.tv/naseongkim');
  } else if (status.value === 'criticalEdit') {
    window.open(`${VITE_HOST_URL}/detail/${clip.value?.clipName}`);
  } else if (status.value === 'createFailed') {
    (await createClip())
      ? (status.value = 'success')
      : (status.value = 'criticalCreate');
  }
}

async function createClip() {
  status.value = 'create';
  const createClip = await (await axios
    .get(`${VITE_API_URL}/createClip`)
    .catch(async () => {
      await auth.refreshAuthority();
      return await axios.get(`${VITE_API_URL}/createClip`);
    })
  ).data;

  if (!createClip) {
    status.value = 'createFailed';
    return false;
  }

  clip.value = createClip;
  status.value = 'success';
}

window.addEventListener('message', async (e) => {
  if (e.origin !== VITE_HOST_URL) return;
  if (e.data.status === 'online' || e.data.window) {
    tab.value = true;
  } else {
    e.data.devtoolsEnabled ? (tab.value = true) : (tab.value = false);
  }
});
</script>
<template>
  <div>
    <ExtensionHeader />
    <ExtensionAd />
    <div class="m-auto mb-24 flex max-w-sm flex-col p-5">
      <div
        class="flex flex-col rounded-3xl p-5"
        :class="{
          'bg-slate-200': blockStatus.color === 'slate',
          'bg-blue-200': blockStatus.color === 'blue',
          'bg-green-200': blockStatus.color === 'green',
          'bg-red-200': blockStatus.color === 'red',
        }"
      >
        <span
          class="icon"
          :class="blockStatus.icon"
        />
        <div
          :class="{
            'mb-2 overflow-hidden text-xl font-semibold line-clamp-2':
              status === 'online',
            'text-2xl': status === 'offline',
            'text-xl': status !== 'offline',
          }"
        >
          {{ blockStatus.title }}
        </div>
        <div v-if="status === 'online'">
          <div class="overflow-hidden text-base line-clamp-1">
            {{ streamInfo?.game_name }}
          </div>
          <div class="text-base">
            {{ dayjs().locale("ko").to(dayjs(streamInfo?.started_at)) }}
          </div>
        </div>
        <div v-if="status === 'success'">
          <div class="mt-6 mb-1">
            클립의 이름을 정할 수 있어요.
          </div>
          <div class="mb-2 text-sm">
            이름을 정하지 않으면 방송 제목을 그대로 사용해요. 언제든지 변경할 수
            있어요.
          </div>
          <input
            :placeholder="streamInfo?.title"
            :value="clipName"
            type="text"
            class="w-full rounded-xl border-white py-3 px-4"
            @input="updateInput"
          >
        </div>
        <button
          v-if="blockStatus.button"
          target="_blank"
          class="mt-4 cursor-pointer rounded-3xl p-4 text-base no-underline transition-all duration-300 hover:shadow-lg"
          :class="{
            hidden: status === 'online' && tab,
            'bg-slate-100 hover:shadow-slate-400':
              blockStatus.color === 'slate',
            'bg-blue-100 hover:shadow-blue-400': blockStatus.color === 'blue',
            'bg-green-100 hover:shadow-green-400':
              blockStatus.color === 'green',
            'bg-red-100 hover:shadow-red-400': blockStatus.color === 'red',
          }"
          @click="buttonAction"
        >
          {{ blockStatus.buttonText }}
        </button>
      </div>
      <div class="mt-8 mb-1 text-lg font-bold">
        바로가기
      </div>
      <div class="flex gap-3">
        <a
          href="https://app.twip.kr/donate/naseongkim"
          target="_blank"
          class="flex h-32 w-1/2 cursor-pointer flex-col items-start justify-between rounded-3xl bg-rose-500 p-5 text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-rose-300"
        ><i class="icon xi-heart xi-2x" />방송 후원하기</a>
        <a
          href="https://tgd.kr/s/naseongkim"
          target="_blank"
          class="flex h-32 w-1/2 cursor-pointer flex-col items-start justify-between rounded-3xl bg-[#9146ff] p-5 text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-300"
        ><i class="icon xi-speech xi-2x" />트게더</a>
      </div>
      <div class="mt-4 mb-1 text-lg font-bold">
        유튜브
      </div>
      <div class="mb-3 flex gap-3">
        <a
          href="https://www.youtube.com/@Naseongkim"
          target="_blank"
          class="flex h-32 w-1/2 cursor-pointer flex-col items-start justify-between rounded-3xl bg-orange-500 p-5 text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-300"
        ><i class="icon xi-play-circle-o xi-2x" />김나성</a>
        <a
          href="https://www.youtube.com/channel/UCxbWbdvNz3VCTVumDIc0XrA"
          target="_blank"
          class="flex h-32 w-1/2 cursor-pointer flex-col items-start justify-between rounded-3xl bg-sky-400 p-5 text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-sky-300"
        ><i class="icon xi-snooze xi-2x" />긴나성</a>
      </div>
      <div class="flex gap-3">
        <a
          href="https://www.youtube.com/channel/UCfLvxrf3KoKpUG0bBHIZJ-g"
          target="_blank"
          class="flex h-32 w-1/2 cursor-pointer flex-col items-start justify-between rounded-3xl bg-slate-400 p-5 text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-slate-300"
        ><i class="icon xi-fast-forward xi-2x" />딥나성</a>
        <div class="h-32 w-1/2 rounded-3xl bg-slate-100" />
      </div>
      <div class="mt-4 mb-1 text-lg font-bold">
        다른 링크
      </div>
      <div class="mb-3 flex gap-3">
        <a
          href="https://bit.ly/3QeyGNd"
          target="_blank"
          class="flex h-32 w-1/2 cursor-pointer flex-col items-start justify-between rounded-3xl bg-red-500 p-5 text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-red-300"
        ><i class="icon xi-calendar xi-2x" />!일정</a>
        <a
          href="https://bit.ly/2N1X9Gp"
          target="_blank"
          class="flex h-32 w-1/2 cursor-pointer flex-col items-start justify-between rounded-3xl bg-green-500 p-5 text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-green-300"
        ><i class="icon xi-truck xi-2x" />!과금</a>
      </div>
      <div class="flex gap-3">
        <a
          href="https://ssakdook.twip.kr/command/naseongkim"
          target="_blank"
          class="flex h-32 w-1/2 cursor-pointer flex-col items-start justify-between rounded-3xl bg-pink-200 p-5 text-base text-black transition-all duration-300 hover:shadow-lg hover:shadow-pink-200"
        ><i class="icon xi-scissors xi-2x" />!명령어</a>
        <a
          href="https://bit.ly/3QeyGNd"
          target="_blank"
          class="hover:hover-slate-200 flex h-32 w-1/2 cursor-pointer flex-col items-start justify-between rounded-3xl bg-slate-100 p-5 text-base text-slate-100 transition-all duration-300 hover:text-black hover:shadow-lg"
        ><i class="icon xi-ban xi-2x" />출입금지</a>
      </div>
    </div>
    <div
      v-if="!loginStatus"
      id="loginButton"
      class="fixed bottom-0 left-1/2 flex w-full max-w-sm -translate-x-1/2 bg-white/30 p-5 backdrop-blur-md"
    >
      <a
        :href="`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=0373yf8vzqpo4f9ln4ajqrq9fim3hd&redirect_uri=${VITE_HOST_URL}/authorization?type=extension&scope=clips%3Aedit%20user%3Aread%3Aemail%20user%3Aread%3Asubscriptions`"
        target="_blank"
        class="flex w-full cursor-pointer items-center justify-center rounded-3xl bg-[#9146ff] p-4 text-base text-white no-underline transition-all duration-300 hover:shadow-lg hover:shadow-purple-300"
      >로그인 하고 클립 만들기</a>
    </div>
    <div
      v-if="status === 'online' && tab && loginStatus"
      class="fixed bottom-0 left-1/2 flex w-full max-w-sm -translate-x-1/2 bg-white/30 p-5 backdrop-blur-md"
    >
      <button
        class="flex w-full cursor-pointer items-center justify-center rounded-3xl bg-[#9146ff] p-4 text-base text-white no-underline transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/60 disabled:cursor-not-allowed disabled:bg-[#9146ff]/30 disabled:hover:shadow-none"
        @click="createClip"
      >
        클립 만들기
      </button>
    </div>
  </div>
</template>
