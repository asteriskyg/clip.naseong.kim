<template>
  <div class="min-h-full min-w-full">
    <div class="mx-auto w-full max-w-7xl" v-if="clip">
      <div class="sm:p-6 sm:pb-0">
        <div class="sm:border" style="position: relative; padding-top: 56.25%">
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
      </div>
      <div class="p-6">
        <div class="mb-1 text-xl line-clamp-2 sm:text-2xl">
          {{ clip.contentName }}
        </div>
        <div class="">
          {{ dayjs().locale("ko").to(dayjs(clip.clipCreatedAt)) }}
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
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import RecentClipList from "../components/RecentClipList.vue";
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
  contentId: string;
  contentName: string;
  creatorId: number;
  creatorName: string;
  gameId: number;
  streamStartedAt: Date;
}

const VITE_API_URL: string = import.meta.env.VITE_API_URL;
const auth = useAuthStore();
const route = useRoute();
const me = ref<User>();
const user = ref<User>();
const clip = ref<Clip>();

onMounted(async () => {
  me.value = auth.me;

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
</script>
