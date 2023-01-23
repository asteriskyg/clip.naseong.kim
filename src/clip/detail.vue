<template>
  <div class="min-h-full min-w-full">
    <div class="mx-auto w-full max-w-7xl" v-if="clip">
      <div class="sm:p-6 sm:pb-0">
        <div
          v-if="!clipUrl"
          class="sm:border"
          style="position: relative; padding-top: 56.25%"
        >
          <iframe
            :src="`https://customer-lsoi5zwkd51of53g.cloudflarestream.com/${clip.contentId}/iframe?preload=true&poster=https%3A%2F%2Fcustomer-lsoi5zwkd51of53g.cloudflarestream.com%2F${clip.contentId}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`"
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
          >
          </iframe>
        </div>
        <div
          v-if="
            dayjs().isBefore(
              dayjs(clip.clipCreatedAt).locale('ko').add(10, 'm')
            ) ||
            (dayjs().isBefore(
              dayjs(clip.clipLastEdited).locale('ko').add(10, 'm')
            ) &&
              !clipUrl)
          "
          class="sm:text-md mx-6 mt-6 flex flex-wrap gap-x-1 rounded-2xl border border-orange-500 bg-orange-50 p-4 text-sm sm:mx-0 md:text-lg"
        >
          <span>아직 클립을 처리하고 있어요.</span>
          <span>클립이 보이지 않거나, 화질이 나쁠 수 있어요.</span>
        </div>
        <div v-if="clipUrl" class="border-b pb-6">
          <div class="aspect-w-16 aspect-h-9 h-0 w-full">
            <video
              ref="trim"
              class="w-full"
              @timeupdate="loop"
              :src="`${clipUrl.url}#t=${value[0]}`"
              controls
              autoplay
              loop
              playsinline
            ></video>
          </div>
          <div class="p-6 pb-0 sm:p-0 sm:pt-6">
            <div class="mb-1 text-2xl">클립 자르기</div>
            <div class="mb-3 flex flex-wrap gap-x-1">
              <span>아래 슬라이더를 조절해 자를 영역을 선택하세요.</span>
              <span>선택하지 않으면 바뀌지 않아요.</span>
            </div>
            <div>
              <n-space vertical>
                <n-slider
                  v-model:value="value"
                  :range="true"
                  :step="1"
                  :max="clip.clipDuration"
                  class="mb-3 rounded-xl border bg-white p-6"
                />
              </n-space>
            </div>
          </div>
          <div class="p-6 pb-12 sm:p-0 sm:pt-6 sm:pb-12">
            <div class="mb-1 text-2xl">이름 바꾸기</div>
            <div class="mb-3 flex flex-wrap gap-x-1">
              <span>클립 이름을 바꾸려면 입력해주세요.</span>
              <span>입력하지 않으면 바뀌지 않아요.</span>
            </div>
            <input
              v-model="editClipName"
              class="w-full rounded-2xl bg-slate-200 px-6 py-4"
              :placeholder="clip.contentName"
            />
          </div>
          <div
            class="flex w-full flex-col justify-end gap-3 px-6 sm:flex-row sm:px-0"
          >
            <button
              @click="
                clipUrl = undefined;
                clipPercent = 0;
              "
              class="transiton-all hidden rounded-2xl bg-slate-200 px-6 py-3 text-black duration-300 sm:block md:hover:bg-slate-300"
            >
              취소
            </button>
            <button
              @click="updateClip"
              :disabled="
                clip.clipDuration === value[1] - value[0] && editClipName === ''
              "
              class="transiton-all rounded-2xl bg-blue-500 px-6 py-4 text-white duration-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:hover:bg-slate-200 sm:py-3 md:hover:bg-blue-600"
            >
              클립 수정하기
            </button>
            <button
              @click="clipUrl = undefined"
              class="transiton-all rounded-2xl bg-slate-200 px-6 py-4 text-black duration-300 sm:hidden md:hover:bg-slate-300"
            >
              취소
            </button>
          </div>
        </div>
        <div v-if="!isClipReady" class="relative">
          <div
            class="sm:text-md mx-6 mt-6 flex flex-wrap gap-x-1 rounded-2xl border border-blue-500 bg-blue-100/50 p-4 text-sm sm:mx-0 md:text-lg"
          >
            <span
              >클립을 준비하고 있어요. 잠시만 기다려주세요. ({{
                clipPercent
              }}%)</span
            >
          </div>
          <div
            class="sm:text-md absolute top-0 left-0 -z-10 flex h-full flex-wrap gap-x-1 rounded-2xl bg-blue-300 text-sm transition-all duration-300 sm:mx-0 md:text-lg"
            :style="`width: ${clipPercent}%`"
          ></div>
        </div>
      </div>
      <div class="flex flex-col items-start justify-between p-6 md:flex-row">
        <div>
          <div class="mb-1 text-xl line-clamp-2 sm:text-2xl">
            {{ clip.contentName }}
          </div>
          <div>
            <span class="text-gray-500">방송일자: </span>
            {{ dayjs(clip.clipCreatedAt).format("YYYY년 MM월 DD일") }} ({{
              dayjs().locale("ko").to(dayjs(clip.clipCreatedAt))
            }})
          </div>
          <div>
            <span class="text-gray-500">타임스탬프: </span>
            {{ timeFromStream }}
          </div>
        </div>
        <button
          v-if="!clipUrl && clip.creatorId === me?.twitchUserId"
          @click="getDownload"
          class="sm:text-md transiton-all mt-6 h-11 rounded-2xl bg-slate-200 px-4 text-sm text-black duration-300 md:mt-0 md:h-12 md:px-5 md:hover:bg-blue-500 md:hover:text-white"
        >
          클립 수정
        </button>
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
        />
        <div>{{ user?.displayName }}</div>
      </a>
      <div class="mx-auto w-full max-w-7xl p-6">
        <div class="mb-2 text-2xl font-bold">다른 클립 더보기</div>
        <RecentClipList />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import RecentClipList from "../components/RecentClipList.vue";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { NSlider, NSpace } from "naive-ui";
dayjs.extend(relativeTime);

interface User {
  displayName: string;
  email: string | null;
  profileImageUrl: string;
  twitchUserId: number;
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
  streamStartedAt: Date;
  clipDuration: number;
}

interface clipUrl {
  percentComplete: number;
  status: string;
  url: string;
}

const VITE_API_URL: string = import.meta.env.VITE_API_URL;
const auth = useAuthStore();
const route = useRoute();
const me = ref<User>();
const user = ref<User>();
const clip = ref<Clip>();
const trim = ref<any>();
const clipUrl = ref<clipUrl>();
const isClipReady = ref(true);
const editClipName = ref<string>("");
const value = ref([0, 0]);
const loginStatus = ref(true);
const clipPercent = ref(0);

watch(value, () => {
  const [min, max] = value.value;

  if (min > max - 10) {
    value.value[0] = max - 10;
    value.value[1] = min + 10;
  }

  if (min === 0 && max <= 10) {
    value.value[0] = 0;
    value.value[1] = 10;
  }

  if (
    min >= clip.value?.clipDuration! - 10 &&
    max === clip.value?.clipDuration
  ) {
    value.value[0] = clip.value?.clipDuration - 10;
    value.value[1] = clip.value?.clipDuration;
  }
});

onMounted(async () => {
  loginStatus.value = await auth.checkAuthority();
  loginStatus.value === true
    ? (me.value = await auth.whoami())
    : (me.value = undefined);

  const clipDetails = await axios.get(`${VITE_API_URL}/getClipDetails`, {
    headers: {
      item: route.params.id,
    },
  });

  clip.value = clipDetails.data;

  const userData = await axios.get(`${VITE_API_URL}/getUser`, {
    headers: {
      id: clipDetails.data.creatorId,
    },
  });

  user.value = userData.data;
});

const timeFromStream = computed(() => {
  if (clip.value) {
    const seconds = dayjs(clip.value.clipCreatedAt)
      .locale("ko")
      .diff(clip.value.streamStartedAt, "s");
    const hour = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = seconds % 60;

    if (hour === 0) {
      return `${minutes}분 ${secondsLeft}초`;
    } else {
      return `${hour}시간 ${minutes}분 ${secondsLeft}초`;
    }
  }
});

async function getDownload() {
  isClipReady.value = false;
  fetch();

  async function fetch() {
    const data = await axios.post(
      `${VITE_API_URL}/trimClip`,
      {
        id: clip.value?.contentId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    clipPercent.value = data.data.percentComplete;
    console.log(clipPercent.value);
    return data.data;
  }

  while (clipPercent.value < 100) {
    await fetch();
    setTimeout(() => {}, 1000);
  }

  if (clipPercent.value === 100) {
    clipUrl.value = await fetch();
    isClipReady.value = true;
  }

  value.value[0] = 0;
  value.value[1] = clip.value?.clipDuration!;
}

async function loop() {
  if (trim.value.currentTime > value.value[1]) {
    trim.value.currentTime = value.value[0];
  }
}

async function updateClip() {
  const updateResult = await axios.post(
    `${VITE_API_URL}/updateClip`,
    {
      id: clip.value?.contentId,
      name: editClipName.value,
      start: value.value[0],
      end: value.value[1],
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }
  );

  window.location.href = `/detail/${updateResult.data}`;
}
</script>
