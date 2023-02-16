<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from './stores/auth';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
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

const VITE_HOST_URL = import.meta.env.VITE_HOST_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const auth = useAuthStore();
const loginStatus = ref(true);
const me = ref<Me | undefined | null>();
const streamInfo = ref<StreamInfo | undefined>();
const modal = ref(false);
const status = ref('loading');
const clipName = ref('');
const tab = ref(false);
let clipId: string;

onMounted(async () => {
  me.value = await auth.whoami();

  if (!me.value) {
    loginStatus.value = false;
    status.value = 'login';
  }

  if (loginStatus.value === true) {
    streamInfo.value = await auth.getStreamInfo();
    streamInfo.value
      ? (status.value = 'online')
      : streamInfo.value === undefined
        ? (status.value = 'offline')
        : (status.value = 'error');
  }

  if (status.value === 'online') { window.postMessage({ status: 'online' }, VITE_HOST_URL); }
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
          id: clipId,
          name: clipName.value,
        })
      ).data;

      if (!updateClipName) {
        status.value = 'editFailed';
        return;
      }

      status.value = 'edit';
    } else {
      window.open(`${VITE_HOST_URL}/detail/${clipId}`);
    }
  } else if (status.value === 'edit') {
    window.open(`${VITE_HOST_URL}/detail/${clipId}`);
  } else if (status.value === 'editFailed') {
    const updateClipName = await (
      await axios.post(`${VITE_API_URL}/editClip`, {
        id: clipId,
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
    streamInfo.value = await auth.getStreamInfo();
    streamInfo.value
      ? (status.value = 'online')
      : streamInfo.value === undefined
        ? (status.value = 'offline')
        : (status.value = 'criticalFetch');
  } else if (status.value === 'criticalFetch') {
    window.open('https://twitch.tv/naseongkim');
  } else if (status.value === 'criticalEdit') {
    window.open(`${VITE_HOST_URL}/detail/${clipId}`);
  } else if (status.value === 'createFailed') {
    (await createClip())
      ? (status.value = 'success')
      : (status.value = 'criticalCreate');
  }
}

async function createClip() {
  status.value = 'create';
  const createClip = await (await axios.get(`${VITE_API_URL}/createClip`)).data;

  if (!createClip) {
    status.value = 'createFailed';
    return false;
  }

  clipId = createClip.clipId;
  status.value = 'success';
}

async function logout() {
  await axios.get(`${VITE_API_URL}/logout`);
  window.location.href = '/extension';
}

window.addEventListener('message', async (e) => {
  if (e.origin !== VITE_HOST_URL) return;
  if (e.data.status === 'online' || e.data.window) {
    tab.value = true;
  } else {
    e.data.devtoolsEnabled
      ? tab.value = true
      : tab.value = false;
  }
});
</script>
<template>
  <div>
    <div
      class="w-full border-b bg-slate-100/50 backdrop-blur-lg"
    >
      <div class="m-auto w-full max-w-sm px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center text-3xl">
            <a
              href="/"
              target="_blank"
              class="text-3xl"
            >na.<b>clip</b></a>
          </div>
          <button v-if="me">
            <img
              :src="me.profileImageUrl"
              class="h-10 w-10 rounded-full border"
              alt=""
              @click="modal = !modal"
            >
          </button>
        </div>
        <div v-if="modal">
          <div class="mt-6 flex flex-col rounded-3xl bg-slate-200 p-5">
            <img
              :src="me?.profileImageUrl"
              class="mb-3 h-16 w-16 rounded-2xl border-2"
              :alt="`${me?.displayName}님의 트위치 프로필 이미지`"
            >
            <span
              class="overflow-hidden text-xl font-semibold line-clamp-1"
              style="overflow-wrap: anywhere"
            >
              {{ me?.displayName }}
            </span>
            <a
              :href="`${VITE_HOST_URL}/profile/${me?.twitchUserId}`"
              target="_blank"
              class="mt-6 cursor-pointer rounded-2xl bg-slate-300 p-3 text-center text-base no-underline transition-all duration-300 hover:shadow-lg hover:shadow-slate-400"
            >내 프로필 보기
            </a>
            <button
              class="mt-2 cursor-pointer rounded-2xl bg-red-200 p-3 text-center text-base no-underline transition-all duration-300 hover:shadow-lg hover:shadow-red-400"
              @click="logout"
            >
              로그아웃
            </button>
          </div>
          <div class="pt-2 text-center text-sm text-slate-500">
            확장 프로그램 버전 2.1.0
          </div>
        </div>
      </div>
    </div>
    <div class="m-auto flex max-w-sm flex-col p-5 mb-24">
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
          class="mt-4 cursor-pointer rounded-2xl p-4 text-center text-base no-underline transition-all duration-300 hover:shadow-lg"
          :class="{
            'hidden': status === 'online' && tab,
            'bg-slate-100 hover:shadow-slate-400':
              blockStatus.color === 'slate',
            'bg-blue-100 hover:shadow-blue-400': blockStatus.color === 'blue',
            'bg-green-100 hover:shadow-green-400': blockStatus.color === 'green',
            'bg-red-100 hover:shadow-red-400': blockStatus.color === 'red',
          }"
          @click="buttonAction"
        >
          {{ blockStatus.buttonText }}
        </button>
      </div>
      <div>
        <div class="mt-12 text-lg font-bold mb-2">
          바로가기
        </div>
      </div>
      <div class="flex gap-4 mb-4">
        <a
          href="https://tgd.kr/s/naseongkim"
          target="_blank"
          class="flex flex-col w-1/2 h-32 justify-between cursor-pointer items-start rounded-3xl bg-[#9146ff] p-5 text-center text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/60"
        ><i class="icon xi-twitch xi-2x" />김나성 트위치</a>
        <a
          href="https://tgd.kr/s/naseongkim"
          target="_blank"
          class="flex flex-col w-1/2 h-32 justify-between cursor-pointer items-start rounded-3xl bg-[#9146ff] p-5 text-center text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/60"
        ><i class="icon xi-speech xi-2x" />김나성 트게더</a>
      </div>
      <div class="flex gap-4 mb-4">
        <a
          href="https://www.youtube.com/@Naseongkim"
          target="_blank"
          class="flex flex-col w-1/2 h-32 justify-between cursor-pointer items-start rounded-3xl bg-orange-500 p-5 text-center text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-600"
        ><i class="icon xi-play-circle-o xi-2x" />김나성 유튜브</a>
        <a
          href="https://www.youtube.com/channel/UCxbWbdvNz3VCTVumDIc0XrA"
          target="_blank"
          class="flex flex-col w-1/2 h-32 justify-between cursor-pointer items-start rounded-3xl bg-sky-400 p-5 text-center text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-sky-500"
        ><i class="icon xi-snooze xi-2x" />긴나성</a>
      </div>
      <div class="flex gap-4">
        <a
          href="https://www.youtube.com/channel/UCfLvxrf3KoKpUG0bBHIZJ-g"
          target="_blank"
          class="flex flex-col w-1/2 h-32 justify-between cursor-pointer items-start rounded-3xl bg-slate-500 p-5 text-center text-base text-white transition-all duration-300 hover:shadow-lg hover:shadow-slate-600"
        ><i class="icon xi-fast-forward xi-2x" />딥나성</a>
        <div
          class="w-1/2 h-32 rounded-3xl bg-slate-100"
        />
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
        class="flex w-full cursor-pointer items-center justify-center rounded-3xl bg-[#9146ff] p-4 text-center text-base text-white no-underline transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/60"
      >트위치로 로그인</a>
    </div>
    <div
      v-if="status === 'online' && tab"
      class="fixed bottom-0 left-1/2 flex w-full max-w-sm -translate-x-1/2 bg-white/30 p-5 backdrop-blur-md"
    >
      <button
        class="flex w-full cursor-pointer items-center justify-center rounded-3xl bg-[#9146ff] p-4 text-center text-base text-white no-underline transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/60 disabled:cursor-not-allowed disabled:bg-[#9146ff]/30 disabled:hover:shadow-none"
        @click="createClip"
      >
        클립 만들기
      </button>
    </div>
  </div>
</template>
