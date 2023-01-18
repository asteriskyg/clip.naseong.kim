<template>
  <div class="min-w-full min-h-full">
    <div class="w-full max-w-7xl mx-auto" v-if="clip">
      <div class="sm:p-6 sm:pb-0">
        <div class="sm:border" style="position: relative; padding-top: 56.25%;">
          <iframe
            :src="`https://customer-lsoi5zwkd51of53g.cloudflarestream.com/${clip.contentId}/iframe?preload=true&poster=https%3A%2F%2Fcustomer-lsoi5zwkd51of53g.cloudflarestream.com%2F${clip.contentId}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`"
            style="border: none; position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowfullscreen="true">
          </iframe>
        </div>
      </div>
      <div class="p-6">
        <div class="text-xl sm:text-2xl mb-1 line-clamp-2">{{ clip.contentName }}</div>
        <div class="">{{ dayjs().locale('ko').to(dayjs(clip.clipCreatedAt)) }}</div>
      </div>
      <div class="flex items-center gap-3 px-6 py-3 border-y sm:border-0 sm:py-0 mb-6">
        <img class="border rounded-full w-8 h-8" :src="userPic" alt="">
        <div>{{ clip.creatorName }}</div>
      </div>
      <div class="w-full max-w-7xl mx-auto p-6">
        <div class="text-2xl font-bold mb-2">다른 클립 더보기</div>
        <RecentClipList/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import axios from 'axios';
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import relativeTime from 'dayjs/plugin/relativeTime'
import RecentClipList from './components/RecentClipList.vue';
dayjs.extend(relativeTime)

interface me {
  displayName: string;
  email: string;
  profileImageUrl: string;
  twitchUserId: number;
}

interface clip {
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

const VITE_API_URL:string = import.meta.env.VITE_API_URL;
const auth = useAuthStore()
const route = useRoute()
const me = ref<me>();
const userPic = ref<string>();
const clip = ref<clip>();


onMounted(async () => {
  me.value = auth.me

  const clipDetails = await axios.get(`${VITE_API_URL}/getClipDetails`, {
    headers: {
      item: route.params.id
    }
  })
  clip.value = clipDetails.data

  const userPicData = await axios.get(`${VITE_API_URL}/getUserPic`, {
    headers: {
      id: clipDetails.data.creatorId
    }
  })
  console.log(userPicData.data)

  userPic.value = userPicData.data.profileImageUrl
})
</script>
