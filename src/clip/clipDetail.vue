<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NSlider, NSpace } from 'naive-ui';
import { useAuthStore } from '../stores/auth';
import RecentClipList from '../components/RecentClipList.vue';
import { useAuth } from '../plugins/useAuth';
import 'dayjs/locale/ko';
dayjs.extend(relativeTime);

interface User {
  displayName: string;
  email: string | null;
  profileImageUrl: string;
  twitchUserId: number;
  userType: string;
}

interface Clip {
  __v: number;
  _id: string;
  clipCreatedAt: Date;
  clipLastEdited: Date;
  contentId: string;
  contentName: string;
  creatorId: number;
  creatorName: string;
  gameId: number;
  gameName: string;
  streamStartedAt: Date;
  clipDuration: number;
  clipName: string;
}

interface Fetch {
  percentComplete: number;
  status: string;
  url: string;
}

const VITE_API_URL: string = import.meta.env.VITE_API_URL;
const auth = useAuth();
const store = useAuthStore();
const route = useRoute();

const me = ref<typeof store.me>();
const user = ref<User>();
const clip = ref<Clip>();
const video = ref<HTMLVideoElement>();
const edit = ref(false);
const fetch = ref<Fetch>();
const newClipName = ref<string>('');
const timecode = ref([0, 0]);
const counter = ref(1);
const modal = ref(false);

onMounted(async () => {
  me.value = await store.whoami();
  clip.value = await (
    await axios
      .get(`${VITE_API_URL}/clip/detail?id=${route.params.id}`)
      .catch(async () => {
        await auth.refreshAuthority();
        return await axios.get(`${VITE_API_URL}/clip/detail?id=${route.params.id}`);
      })
  ).data;
  user.value = await (
    await axios
      .get(`${VITE_API_URL}/user/detail?id=${clip.value?.creatorId}`)
      .catch(async () => {
        await auth.refreshAuthority();
        return await axios.get(`${VITE_API_URL}/user/detail?id=${clip.value?.creatorId}`);
      })
  ).data;
});

watch(timecode, () => {
  if (!clip.value) return;
  const [min, max] = timecode.value;

  if (min > max - 10) {
    timecode.value[0] = max - 10;
    timecode.value[1] = min + 10;
  }

  if (min === 0 && max <= 10) {
    timecode.value[0] = 0;
    timecode.value[1] = 10;
  }

  if (
    min >= clip.value?.clipDuration - 10 &&
    max === clip.value?.clipDuration
  ) {
    timecode.value[0] = clip.value?.clipDuration - 10;
    timecode.value[1] = clip.value?.clipDuration;
  }
});

const timestamp = computed(() => {
  const toSeconds =
    dayjs(clip.value?.clipCreatedAt)
      .locale('ko')
      .diff(clip.value?.streamStartedAt, 's');
  const hour = Math.floor(toSeconds / 3600);
  const minutes = Math.floor((toSeconds % 3600) / 60);
  const secondsLeft = toSeconds % 60;

  if (hour === 0) return `${minutes}분 ${secondsLeft}초`;
  return `${hour}시간 ${minutes}분 ${secondsLeft}초`;
});

const updateInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newText = target.value;
  newClipName.value = newText;
};

const download = async (type: string) => {
  if (!clip.value) return;

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (true) {
    fetch.value = (
      await axios
        .get(`${VITE_API_URL}/clip/download?id=${clip.value?.clipName}`)
        .catch(async () => {
          await auth.refreshAuthority();
          return await axios.get(`${VITE_API_URL}/clip/download?id=${clip.value?.clipName}`);
        })
    ).data;
    if (fetch.value?.status === 'ready') break;
    counter.value = counter.value + 1;
    await sleep(1000);
  }

  if (type === 'edit') {
    timecode.value[0] = 0;
    timecode.value[1] = clip.value.clipDuration;
    edit.value = true;
  } else if (type === 'download') {
    const target = document.createElement('a');
    target.href = fetch.value.url;
    target.click();
  }
};

const loop = () => {
  if (!video.value) return;

  if (video.value.currentTime > timecode.value[1]) {
    video.value.currentTime = timecode.value[0];
  }
};

const updateClip = async () => {
  console.log(clip.value?.contentName, newClipName.value);
  if (clip.value?.contentName !== newClipName.value) {
    await axios
      .post(`${VITE_API_URL}/clip/edit?id=${clip.value?.clipName}`, {
        data: { contentName: newClipName.value },
      })
      .catch(async () => {
        await auth.refreshAuthority();
        return await axios.post(`${VITE_API_URL}/clip/trim?id=${clip.value?.clipName}`, {
          data: { name: newClipName.value },
        });
      });
  }

  if (clip.value?.clipDuration !== timecode.value[1] - timecode.value[0]) {
    await axios
      .post(`${VITE_API_URL}/clip/trim?id=${clip.value?.clipName}`, {
        start: timecode.value[0],
        end: timecode.value[1],
      })
      .catch(async () => {
        await auth.refreshAuthority();
        return await axios.post(`${VITE_API_URL}/clip/trim?id=${clip.value?.clipName}`, {
          start: timecode.value[0],
          end: timecode.value[1],
        });
      });
  }

  location.reload();
};

const deleteClip = async () => {
  await axios
    .delete(`${VITE_API_URL}/clip/delete?id=${clip.value?.clipName}`)
    .catch(async () => {
      await auth.refreshAuthority();
      return await axios.delete(`${VITE_API_URL}/clip/delete?id=${clip.value?.clipName}`);
    });

  location.href = '/';
};
</script>
<template>
  <div class="min-h-full min-w-full">
    <div
      v-if="clip"
      class="mx-auto w-full max-w-7xl"
    >
      <div class="sm:p-6 sm:pb-0">
        <div
          v-if="clip && fetch?.status !== 'ready'"
          class="sm:overflow-hidden sm:rounded-lg border-b sm:border md:rounded-2xl dark:border-neutral-600"
          style="position: relative; padding-top: 56.25%"
        >
          <iframe
            :src="`https://customer-lsoi5zwkd51of53g.cloudflarestream.com/${clip.contentId}/iframe?preload=true&loop=true&poster=https%3A%2F%2Fcustomer-lsoi5zwkd51of53g.cloudflarestream.com%2F${clip.contentId}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`"
            style=" border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowfullscreen="true"
          />
        </div>
        <div v-if="edit && fetch?.status === 'ready'">
          <div class="aspect-w-16 aspect-h-9 w-full">
            <video
              ref="trim"
              class="w-full"
              :src="`${fetch?.url}#t=${timecode[0]}`"
              controls
              autoplay
              loop
              playsinline
              @timeupdate="loop"
            />
          </div>
          <div class="m-6 sm:mx-0 p-6 text-black dark:text-slate-200 bg-slate-100 dark:bg-neutral-800 rounded-3xl">
            <div class="mb-1 text-xl md:text-2xl">
              클립 자르기
            </div>
            <div class="mb-3 md:text-lg flex flex-wrap gap-x-1">
              <span>아래 슬라이더를 조절해 자를 영역을 선택하세요.</span>
              <span>선택하지 않으면 바뀌지 않아요.</span>
            </div>
            <div>
              <n-space vertical>
                <n-slider
                  v-model:value="timecode"
                  :range="true"
                  :step="1"
                  :max="clip.clipDuration"
                  class="rounded-2xl bg-slate-200 dark:bg-neutral-700 p-8 mb-6"
                />
              </n-space>
            </div>
            <div class="mb-1 text-xl md:text-2xl">
              이름 바꾸기
            </div>
            <div class="mb-3 md:text-lg flex flex-wrap gap-x-1">
              <span>클립 이름을 바꾸려면 입력하세요.</span>
              <span>입력하지 않으면 바뀌지 않아요.</span>
            </div>
            <input
              :value="newClipName"
              class="w-full rounded-2xl bg-slate-200 dark:bg-neutral-700 px-6 py-5 mb-12"
              :placeholder="clip.contentName"
              @input="updateInput"
            >
            <div
              class="flex w-full flex-col justify-end gap-3 sm:flex-row"
            >
              <button
                :disabled="
                  clip.clipDuration === timecode[1] - timecode[0] &&
                    newClipName === ''
                "
                class="transiton-all rounded-2xl bg-blue-500 dark:bg-blue-800/50 px-6 py-4 text-white dark:text-slate-200 duration-300 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3 hover:bg-blue-600 dark:hover:bg-blue-800"
                @click="updateClip"
              >
                클립 수정
              </button>
              <button
                class="transiton-all rounded-2xl bg-slate-200 dark:bg-neutral-700 px-6 py-4 text-black dark:text-slate-200 duration-300 ease-in-out hover:bg-slate-300 dark:hover:bg-neutral-600"
                @click="fetch = undefined"
              >
                취소
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="
            (dayjs().isBefore(dayjs(clip.clipCreatedAt).locale('ko').add(10, 'm'))
              || dayjs().isBefore(dayjs(clip.clipLastEdited).locale('ko').add(10, 'm'))) && !fetch
          "
          class="sm:text-md mx-6 mt-6 sm:mx-0 flex flex-col md:flex-row items-start md:items-center rounded-2xl bg-orange-100 dark:bg-yellow-800/50 p-4 sm:text-lg text-dark dark:text-slate-200"
        >
          <svg
            class="animate-spin mr-3 mb-3 md:mb-0 h-6 w-6 text-orange-500 dark:text-yellow-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <div class="flex flex-wrap gap-x-1">
            <span>아직 동영상 처리 중이에요.</span>
            <span>클립이 보이지 않거나, 화질이 나쁠 수 있어요.</span>
          </div>
        </div>
        <div
          v-if="fetch?.status === 'inprogress'"
          class="relative mx-6 mt-6 sm:mx-0"
        >
          <div
            class="sm:text-md mt-6 sm:mx-0 flex flex-col md:flex-row items-start md:items-center rounded-2xl bg-blue-100 dark:bg-blue-900/50 p-4 sm:text-lg text-dark dark:text-slate-200"
          >
            <svg
              class="animate-spin mr-3 mb-3 md:mb-0 h-6 w-6 text-blue-500 z-10"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span class="z-10">{{
              counter < 30 ? `클립을 준비하고 있어요. 잠시만 기다려주세요. (${fetch?.percentComplete || 0}%)`
              : `평소보다 시간이 걸리고 있어요. 조금만 더 기다려주세요. (${fetch?.percentComplete || 0}%)`
            }}</span>
          </div>
          <div
            class="sm:text-md absolute top-0 left-0 flex h-full flex-wrap gap-x-1 rounded-2xl bg-blue-200 dark:bg-blue-800 p-4 text-sm transition-all duration-300 md:text-lg"
            :style="`width: ${fetch?.percentComplete || 0}%`"
          />
        </div>
      </div>
      <div class="flex flex-col items-start justify-between gap-6 p-6 md:flex-row text-black dark:text-slate-200">
        <div>
          <div class="text-xl line-clamp-1 sm:text-2xl">
            {{ clip.contentName }}
          </div>
          <div class="mb-3">
            {{ clip.gameName }}
          </div>
          <div>
            <span class="text-gray-400">방송일자: </span>
            {{ dayjs(clip.streamStartedAt).format("YYYY년 MM월 DD일") }} ({{
              dayjs().locale("ko").to(dayjs(clip.streamStartedAt))
            }})
          </div>
          <div v-if="clip.gameId !== 999">
            <span class="text-gray-400">타임스탬프: </span>
            {{ timestamp }}
          </div>
          <a
            v-else
            :href="`https://www.youtube.com/clip/${clip.clipName}`"
            class="underline underline-offset-2 rounded-xl text-red-500 hover:text-red-600 dark:text-red-700 dark:hover:text-red-600 transiton-all duration-300"
          >YouTube에서 보기</a>
        </div>
        <div class="flex shrink-0 gap-3">
          <button
            v-if="!fetch && clip.creatorId === me?.twitchUserId"
            class="sm:text-md transiton-all h-11 rounded-2xl bg-slate-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-4 text-sm text-black dark:text-slate-200 duration-300 md:h-12 md:px-5 md:hover:bg-slate-200"
            @click="download('edit')"
          >
            수정
          </button>
          <button
            v-if="!fetch && me && me?.userType !== 'viewer'"
            class="sm:text-md transiton-all h-11 rounded-2xl bg-slate-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-4 text-sm text-black dark:text-slate-200 duration-300 md:h-12 md:px-5 md:hover:bg-slate-200"
            @click="download('download')"
          >
            다운로드
          </button>
          <button
            v-if="!fetch && clip.creatorId === me?.twitchUserId || !fetch && me?.userType && me?.userType !== 'viewer'"
            class="sm:text-md transiton-all h-11 rounded-2xl bg-red-500 dark:bg-red-800/50 dark:hover:bg-red-800 px-4 text-sm text-white duration-300 md:h-12 md:px-5 md:hover:bg-red-600"
            @click="modal = !modal"
          >
            삭제
          </button>
        </div>
      </div>
      <div class="flex px-0 md:px-6 mb-6">
        <a
          v-if="user"
          :href="`/profile/${user.twitchUserId}`"
          class="w-full md:w-auto flex items-center gap-3 border-y dark:border-neutral-600 md:border-0 md:bg-slate-100 dark:md:bg-neutral-800 rounded-none md:rounded-2xl px-4 py-2 text-dark dark:text-slate-200 hover:bg-slate-200 hover:dark:bg-neutral-700 transition-colors duration-300 ease-in-out"
        >
          <img
            class="h-8 w-8 rounded-full border dark:border-neutral-600"
            :src="user?.profileImageUrl"
            alt=""
          >
          {{ user?.displayName }}
        </a>
      </div>
      <div class="mx-auto w-full max-w-7xl p-6">
        <RecentClipList
          :title="'다른 클립 더보기'"
          :get="'recent'"
        />
      </div>
    </div>
  </div>
  <div
    v-if="modal"
    class="fixed top-0 left-0 w-screen h-screen bg-slate-500/30 z-40 backdrop-blur-xl"
  >
    <div class="absolute w-full sm:max-w-sm h-full sm:h-auto top-1/2 left-1/2 p-6 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-twitch-dark sm:rounded-3xl sm:shadow-2xl text-black dark:text-slate-200">
      <div
        class="rounded-2xl overflow-hidden mb-6 border dark:border-neutral-600"
        style="position: relative; padding-top: 56.25%"
      >
        <iframe
          v-if="clip"
          :src="`https://customer-lsoi5zwkd51of53g.cloudflarestream.com/${clip.contentId}/iframe?preload=true&loop=true&poster=https%3A%2F%2Fcustomer-lsoi5zwkd51of53g.cloudflarestream.com%2F${clip.contentId}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`"
          style=" border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowfullscreen="true"
        />
      </div>
      <div class="text-xl mb-1">
        이 클립을 삭제할까요?
      </div>
      <div class=" mb-12">
        삭제한 클립은 다시 복구할 수 없어요.
      </div>
      <div class="flex justify-end gap-3">
        <button
          class="transition-colors duration-300 bg-slate-100 dark:bg-neutral-800 px-6 py-3 rounded-2xl hover:bg-slate-200 dark:hover:bg-neutral-700"
          @click="modal = !modal"
        >
          취소
        </button>
        <button
          class="transition-colors duration-300 bg-red-500 dark:bg-red-800 px-6 py-3 rounded-2xl text-white hover:bg-red-600 dark:hover:bg-red-700"
          @click="deleteClip"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
</template>
