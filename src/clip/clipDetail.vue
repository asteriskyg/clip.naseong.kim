<template>
  <div class="min-h-full min-w-full">
    <div
      v-if="clip"
      class="mx-auto w-full max-w-7xl"
    >
      <div class="sm:p-6 sm:pb-0">
        <div
          v-if="!clipUrl"
          class="sm:overflow-hidden sm:rounded-lg sm:border md:rounded-xl"
          style="position: relative; padding-top: 56.25%"
        >
          <iframe
            :src="`https://customer-lsoi5zwkd51of53g.cloudflarestream.com/${clip.contentId}/iframe?preload=true&loop=true&poster=https%3A%2F%2Fcustomer-lsoi5zwkd51of53g.cloudflarestream.com%2F${clip.contentId}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`"
            style="
              border: none;
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              width: 100%;
            "
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowfullscreen="true"
          />
        </div>
        <div
          v-if="
            (dayjs().isBefore(
              dayjs(clip.clipCreatedAt).locale('ko').add(10, 'm')
            ) ||
              dayjs().isBefore(
                dayjs(clip.clipLastEdited).locale('ko').add(10, 'm')
              )) &&
              !clipUrl
          "
          class="sm:text-md mx-6 mt-6 flex flex-wrap gap-x-1 rounded-2xl border border-orange-500 bg-orange-50 p-4 text-sm sm:mx-0 md:text-lg"
        >
          <span>아직 클립을 처리하고 있어요.</span>
          <span>클립이 보이지 않거나, 화질이 나쁠 수 있어요.</span>
        </div>
        <div
          v-if="clipUrl"
          class="border-b pb-6"
        >
          <div class="aspect-w-16 aspect-h-9 h-0 w-full">
            <video
              ref="trim"
              class="w-full"
              :src="`${clipUrl.url}#t=${timecode[0]}`"
              controls
              autoplay
              loop
              playsinline
              @timeupdate="loop"
            />
          </div>
          <div class="p-6 pb-0 sm:p-0 sm:pt-6">
            <div class="mb-1 text-2xl">
              클립 자르기
            </div>
            <div class="mb-3 flex flex-wrap gap-x-1">
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
                  class="mb-3 rounded-xl border bg-white p-6"
                />
              </n-space>
            </div>
          </div>
          <div class="p-6 pb-12 sm:p-0 sm:pt-6 sm:pb-12">
            <div class="mb-1 text-2xl">
              이름 바꾸기
            </div>
            <div class="mb-3 flex flex-wrap gap-x-1">
              <span>클립 이름을 바꾸려면 입력해주세요.</span>
              <span>입력하지 않으면 바뀌지 않아요.</span>
            </div>
            <input
              :value="editClipName"
              class="w-full rounded-2xl bg-slate-200 px-6 py-4"
              :placeholder="clip.contentName"
              @input="updateInput"
            >
          </div>
          <div
            class="flex w-full flex-col justify-end gap-3 px-6 sm:flex-row sm:px-0"
          >
            <button
              class="transiton-all hidden rounded-2xl bg-slate-200 px-6 py-3 text-black duration-300 sm:block md:hover:bg-slate-300"
              @click="
                clipUrl = undefined;
                clipPercent = 0;
              "
            >
              취소
            </button>
            <button
              :disabled="
                clip.clipDuration === timecode[1] - timecode[0] &&
                  editClipName === ''
              "
              class="transiton-all rounded-2xl bg-blue-500 px-6 py-4 text-white duration-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:bg-slate-200 sm:py-3 md:hover:bg-blue-600"
              @click="updateClip"
            >
              클립 수정하기
            </button>
            <button
              class="transiton-all rounded-2xl bg-slate-200 px-6 py-4 text-black duration-300 sm:hidden md:hover:bg-slate-300"
              @click="clipUrl = undefined"
            >
              취소
            </button>
          </div>
        </div>
        <div
          v-if="!isClipReady"
          class="relative mx-6 mt-6 sm:mx-0"
        >
          <div
            class="sm:text-md flex flex-wrap gap-x-1 rounded-2xl border border-blue-500 bg-blue-100/50 p-4 text-sm md:text-lg"
          >
            <span>{{ prepareClip }}</span>
          </div>
          <div
            class="sm:text-md absolute top-0 left-0 -z-10 flex h-full flex-wrap gap-x-1 rounded-2xl bg-blue-300 p-4 text-sm transition-all duration-300 md:text-lg"
            :style="`width: ${clipPercent}%`"
          />
        </div>
      </div>
      <div
        class="flex flex-col items-start justify-between gap-6 p-6 md:flex-row"
      >
        <div>
          <div class="text-xl line-clamp-1 sm:text-2xl">
            {{ clip.contentName }}
          </div>
          <div class="mb-3">
            {{ clip.gameName }}
          </div>
          <div>
            <span class="text-gray-500">방송일자: </span>
            {{ dayjs(clip.streamStartedAt).format("YYYY년 MM월 DD일") }} ({{
              dayjs().locale("ko").to(dayjs(clip.streamStartedAt))
            }})
          </div>
          <div>
            <span class="text-gray-500">타임스탬프: </span>
            {{ timeFromStream }}
          </div>
        </div>
        <div class="flex shrink-0 gap-3">
          <button
            v-if="!clipUrl && clip.creatorId === me?.twitchUserId"
            class="sm:text-md transiton-all mt-6 h-11 rounded-2xl bg-slate-200 px-4 text-sm text-black duration-300 md:mt-0 md:h-12 md:px-5 md:hover:bg-blue-500 md:hover:text-white"
            @click="editClip"
          >
            클립 수정
          </button>
          <button
            v-if="!clipUrl && me && me?.userType !== 'viewer'"
            class="sm:text-md transiton-all mt-6 h-11 rounded-2xl bg-slate-200 px-4 text-sm text-black duration-300 md:mt-0 md:h-12 md:px-5 md:hover:bg-blue-500 md:hover:text-white"
            @click="downloadClip"
          >
            클립 다운로드
          </button>
          <button
            v-if="!clipUrl && clip.creatorId === me?.twitchUserId || me?.userType && me?.userType !== 'viewer'"
            class="sm:text-md transiton-all mt-6 h-11 rounded-2xl bg-red-500 px-4 text-sm text-white duration-300 md:mt-0 md:h-12 md:px-5 md:hover:bg-red-600"
            @click="removeModal = !removeModal"
          >
            클립 삭제
          </button>
        </div>
      </div>
      <a
        v-if="user"
        :href="`/profile/${user.twitchUserId}`"
        class="mb-6 flex items-center gap-3 border-y px-6 py-3 sm:border-0 sm:py-0"
      >
        <img
          class="h-8 w-8 rounded-full border"
          :src="user?.profileImageUrl"
          alt=""
        >
        <div>{{ user?.displayName }}</div>
      </a>
      <div class="mx-auto w-full max-w-7xl p-6">
        <div class="mb-4 text-2xl font-bold">
          다른 클립 더보기
        </div>
        <RecentClipList />
      </div>
    </div>
  </div>
  <div
    v-if="removeModal"
    class="fixed top-0 left-0 w-screen h-screen bg-slate-500/30 z-20 backdrop-blur-xl"
  >
    <div class="absolute w-full sm:max-w-sm h-full sm:h-auto top-1/2 left-1/2 p-6 -translate-x-1/2 -translate-y-1/2 bg-white sm:rounded-3xl sm:shadow-2xl">
      <div
        class="rounded-2xl overflow-hidden mb-6"
        style="position: relative; padding-top: 56.25%"
      >
        <iframe
          v-if="clip"
          :src="`https://customer-lsoi5zwkd51of53g.cloudflarestream.com/${clip.contentId}/iframe?preload=true&loop=true&poster=https%3A%2F%2Fcustomer-lsoi5zwkd51of53g.cloudflarestream.com%2F${clip.contentId}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`"
          style="
            border: none;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
          "
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
          class="transition-colors duration-300 bg-gray-200 px-6 py-3 rounded-2xl hover:bg-gray-300"
          @click="removeModal = !removeModal"
        >
          그만두기
        </button>
        <button
          class="transition-colors duration-300 bg-red-500 px-6 py-3 rounded-2xl text-white hover:bg-red-600"
          @click="removeClip"
        >
          삭제하기
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import RecentClipList from '../components/RecentClipList.vue';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NSlider, NSpace } from 'naive-ui';
import { useAuthStore } from '../stores/auth';
import { useAuth } from '../plugins/useAuth';
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

interface ClipUrl {
  percentComplete: number;
  status: string;
  url: string;
}

const VITE_API_URL: string = import.meta.env.VITE_API_URL;
const auth = useAuth();
const authStore = useAuthStore();
const route = useRoute();
const me = ref<User | undefined>();
const user = ref<User>();
const clip = ref<Clip>();
const trim = ref<HTMLVideoElement>();
const clipUrl = ref<ClipUrl>();
const isClipReady = ref(true);
const editClipName = ref<string>('');
const timecode = ref([0, 0]);
const clipPercent = ref(0);
const counter = ref(1);
const removeModal = ref(false);

watch(timecode, () => {
  if (!clip.value) {
    return;
  }

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

onMounted(async () => {
  me.value = await authStore.whoami();

  clip.value = (
    await axios
      .get(`${VITE_API_URL}/getClipDetails`, {
        headers: {
          item: route.params.id,
        },
      })
      .catch(async () => {
        await auth.refreshAuthority();
        return await axios.get(`${VITE_API_URL}/getClipDetails`, {
          headers: {
            item: route.params.id,
          },
        });
      })
  ).data;

  user.value = (
    await axios
      .get(`${VITE_API_URL}/getUser`, {
        headers: {
          id: clip.value?.creatorId,
        },
      })
      .catch(async () => {
        await auth.refreshAuthority();
        return await axios.get(`${VITE_API_URL}/getUser`, {
          headers: {
            id: clip.value?.creatorId,
          },
        });
      })
  ).data;
});

const prepareClip = computed(() => {
  if (counter.value < 7) {
    return `클립을 준비하고 있어요. 잠시만 기다려주세요. (${clipPercent.value}%)`;
  } else {
    return `평소보다 시간이 걸리고 있어요. 조금만 더 기다려주세요. (${clipPercent.value}%)`;
  }
});

const timeFromStream = computed(() => {
  if (!clip.value) {
    return;
  }

  const seconds = dayjs(clip.value.clipCreatedAt)
    .locale('ko')
    .diff(clip.value.streamStartedAt, 's');
  const hour = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;

  if (hour === 0) {
    return `${minutes}분 ${secondsLeft}초`;
  } else {
    return `${hour}시간 ${minutes}분 ${secondsLeft}초`;
  }
});

const updateInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const updatedText = target.value;
  editClipName.value = updatedText;
};

const editClip = async () => {
  if (!clip.value) {
    return;
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  isClipReady.value = false;
  const fetch = async () => {
    const response = (
      await axios
        .post(`${VITE_API_URL}/trimClip`, {
          id: clip.value?.contentId,
        })
        .catch(async () => {
          await auth.refreshAuthority();
          return await axios.post(`${VITE_API_URL}/trimClip`, {
            id: clip.value?.contentId,
          });
        })
    ).data;

    clipPercent.value = response.percentComplete;
    return response;
  };
  fetch();

  while (clipPercent.value < 100) {
    await fetch();
    counter.value = counter.value + 1;
    await sleep(5000);
  }

  if (clipPercent.value === 100) {
    clipUrl.value = await fetch();
    isClipReady.value = true;
    clipPercent.value = 0;
  }

  timecode.value[0] = 0;
  timecode.value[1] = clip.value.clipDuration;
};

const downloadClip = async () => {
  if (!clip.value) {
    return;
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  isClipReady.value = false;
  fetch();

  async function fetch() {
    const response = (
      await axios
        .post(`${VITE_API_URL}/trimClip`, {
          id: clip.value?.contentId,
        })
        .catch(async () => {
          await auth.refreshAuthority();
          return await axios.post(`${VITE_API_URL}/trimClip`, {
            id: clip.value?.contentId,
          });
        })
    ).data;

    clipPercent.value = response.percentComplete;
    return response;
  }

  while (clipPercent.value < 100) {
    await fetch();
    counter.value = counter.value + 1;
    await sleep(5000);
  }

  if (clipPercent.value === 100) {
    const download = document.createElement('a');
    download.href = await (await fetch()).url;
    download.click();

    isClipReady.value = true;
    clipPercent.value = 0;
  }
};

const loop = () => {
  if (!trim.value) {
    return;
  }

  if (trim.value.currentTime > timecode.value[1]) {
    trim.value.currentTime = timecode.value[0];
  }
};

const updateClip = async () => {
  const updateResult = await axios
    .post(`${VITE_API_URL}/updateClip`, {
      id: clip.value?.contentId,
      name: editClipName.value,
      start: timecode.value[0],
      end: timecode.value[1],
    })
    .catch(async () => {
      await auth.refreshAuthority();
      return await axios.post(`${VITE_API_URL}/updateClip`, {
        id: clip.value?.contentId,
        name: editClipName.value,
        start: timecode.value[0],
        end: timecode.value[1],
      });
    });

  if (updateResult.data !== clip.value?.contentId) {
    axios.post(`${VITE_API_URL}/deleteClip`, {
      newId: updateResult.data,
      id: clip.value?.contentId,
    });
  }

  window.location.href = `/detail/${updateResult.data}`;
};

const removeClip = async () => {
  await axios
    .delete(`${VITE_API_URL}/removeClip`, {
      headers: {
        id: clip.value?.contentId,
      },
    })
    .catch(async () => {
      await auth.refreshAuthority();
      return await axios.delete(`${VITE_API_URL}/removeClip`, {
        headers: {
          id: clip.value?.contentId,
        },
      });
    });

  window.location.href = '/';
};
</script>
