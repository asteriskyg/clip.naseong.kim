<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from './plugins/useAuth';
import { useAuthStore } from './stores/auth';
import axios from 'axios';
import ExtensionHeader from './components/Extension/layouts/ExtensionHeader.vue';
import ExtensionAd from './components/Extension/layouts/ExtensionAd.vue';
import ExCard from './components/ExCard.vue';

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

const VITE_HOST_URL = import.meta.env.VITE_HOST_URL;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const auth = useAuth();
const authStore = useAuthStore();
const me = ref<Me | undefined | null>();
const status = ref('await');
const validate = ref();
const url = ref<string>();

onMounted(async () => {
  window.postMessage({ status: 'online' }, VITE_HOST_URL);
  me.value = await authStore.whoami();
  if (!me.value) status.value = 'login';
});

const fetchClip = async () => {
  status.value = 'fetch';
  const fetch = await axios
    .get(`${VITE_API_URL}/clip/import?url=${url.value}`)
    .catch(async (error) => {
      if (error.response) return error.response;
    });

  if (fetch.status === 202) {
    status.value = 'accepted';
  } else if (fetch.status === 200) {
    status.value = 'duplicated';
  } else if (fetch.status === 401) {
    const authoriry = await auth.refreshAuthority();
    if (authoriry) {
      fetchClip();
    } else {
      status.value = 'login';
    }
  } else {
    status.value = 'fetchFailed';
  }

  validate.value = fetch.data;
};

const updateInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const updatedText = target.value;
  url.value = updatedText;
};
</script>
<template>
  <div>
    <ExtensionHeader />
    <ExtensionAd />
    <div class="m-auto max-w-sm p-5">
      <a
        href="/extension"
        target="_self"
        class="flex mb-3 font-semibold hover:underline underline-offset-4 hover:text-blue-500"
      >← 돌아가기</a>
      <ExCard
        v-if="status === 'await'"
        icon="twitch"
        title="유튜브 클립 주소를 입력해주세요."
        :button="{
          disabled: !url,
          active: true,
          type: 'button',
          text: '클립 가져오기',
          click: fetchClip,
        }"
      >
        <div class="overflow-hidden text-lg">
          긴나성, 딥나성 클립만 가져올 수 있어요.
        </div>
        <input
          placeholder="https://www.youtube.com/clip/xxxxx"
          :value="url"
          type="text"
          class="w-full rounded-2xl border-white p-4"
          @input="updateInput"
        >
      </ExCard>
      <ExCard
        v-if="status === 'fetch'"
        icon="cloud-download-o"
        title="클립을 찾고 있어요."
        :color="{
          bg: 'blue',
          btn: 'blue'
        }"
      />
      <ExCard
        v-if="status === 'accepted'"
        icon="check-circle-o"
        :title="validate.message"
        :color="{
          bg: 'green',
          btn: 'green'
        }"
        :button="{
          active: true,
          type: 'link',
          text: '클립 보러가기',
          href: `${VITE_HOST_URL}/detail/${validate.id}`,
        }"
      />
      <ExCard
        v-if="status === 'fetchFailed'"
        icon="error-o"
        :title="validate.message"
        :color="{
          bg: 'red',
          btn: 'red'
        }"
        :button="{
          active: true,
          type: 'button',
          text: '클립 가져오기',
          click: fetchClip,
        }"
      >
        <div class="overflow-hidden text-lg">
          {{ validate.description }}
        </div>
        <input
          placeholder="https://www.youtube.com/clip/xxxxx"
          :value="url"
          type="text"
          class="w-full rounded-2xl border-white p-4"
          @input="updateInput"
        >
      </ExCard>
      <ExCard
        v-if="status === 'duplicated'"
        icon="documents-o"
        :title="validate.message"
        :color="{
          bg: 'green',
          btn: 'green'
        }"
        :button="{
          active: true,
          type: 'link',
          text: '클립 보러가기',
          href: `${VITE_HOST_URL}/detail/${validate.id}`,
        }"
      />
      <ExCard
        v-if="status === 'login'"
        icon="lock-o"
        title="먼저 로그인해 주세요."
        :color="{
          bg: 'slate',
          btn: 'purple'
        }"
        :button="{
          active: true,
          type: 'link',
          text: '로그인 하고 클립 만들기',
          href: `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=0373yf8vzqpo4f9ln4ajqrq9fim3hd&redirect_uri=${VITE_HOST_URL}/authorization&scope=clips%3Aedit%20user%3Aread%3Aemail%20user%3Aread%3Asubscriptions`,
        }"
      />
      <a
        href="https://support.google.com/youtube/answer/10332730?hl=ko"
        target="_blank"
        class="flex justify-center mt-3 transition-all duration-300 text-slate-600 font-semibold underline underline-offset-4 hover:text-blue-500"
      >유튜브에도 클립이 있어요?</a>
    </div>
  </div>
</template>
