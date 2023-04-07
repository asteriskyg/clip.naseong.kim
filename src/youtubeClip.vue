<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuth } from './plugins/useAuth';
import { useAuthStore } from './stores/auth';
import axios from 'axios';
import ExtensionHeader from './components/Extension/layouts/ExtensionHeader.vue';
import ExtensionAd from './components/Extension/layouts/ExtensionAd.vue';

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
const loginStatus = ref(true);
const me = ref<Me | undefined | null>();
const status = ref('loading');
const clip = ref();
const input = ref('');

onMounted(async () => {
  window.postMessage({ status: 'online' }, VITE_HOST_URL);
  me.value = await authStore.whoami();

  if (!me.value) {
    loginStatus.value = false;
    status.value = 'login';
  } else {
    status.value = 'ready';
  }
});

const blockStatus = computed(() => {
  let icon;
  let title;
  let description;
  let color;
  let button;
  let buttonText;

  if (status.value === 'loading') {
    icon = 'xi-time-o';
    title = '잠시만 기다려 주세요...';
    color = 'slate';
    button = false;
  } else if (status.value === 'ready') {
    icon = 'xi-play-circle-o';
    title = '유튜브 클립 주소를 입력해주세요.';
    description = '긴나성, 딥나성 클립만 가져올 수 있어요.';
    color = 'slate';
    button = true;
    buttonText = '클립 가져오기';
  } else if (status.value === 'create') {
    icon = 'xi-cloud-download-o';
    title = '클립을 찾고 있어요.';
    color = 'blue';
    button = false;
  } else if (status.value === 'createSuccess') {
    icon = 'xi-check-circle-o';
    title = '클립을 가져왔어요.';
    description = '가져온 클립은 유튜브 영상 제목으로 등록돼요. 클립 이름을 바꾸거나, 보러 갈 수 있어요.';
    color = 'green';
    button = true;
    buttonText = '클립 보러가기';
    input.value
      ? (buttonText = '이름 바꾸기')
      : (buttonText = '클립 보러가기');
  } else if (status.value === 'notClip') {
    icon = 'xi-error-o';
    title = '올바른 유튜브 클립이 아니에요.';
    description = '유튜브 클립 주소가 맞는지 확인해주세요.';
    color = 'red';
    button = true;
    buttonText = '클립 가져오기';
  } else if (status.value === 'notExist') {
    icon = 'xi-error-o';
    title = '존재하지 않는 클립이에요.';
    description = '클립이 삭제되었거나, 주소가 잘못됐을 수 있어요.';
    color = 'red';
    button = true;
    buttonText = '클립 가져오기';
  } else if (status.value === 'notAllowedChannel') {
    icon = 'xi-error-o';
    title = '클립을 가져올 수 없는 채널이에요.';
    description = '긴나성, 딥나성 클립만 가져올 수 있어요.';
    color = 'red';
    button = true;
    buttonText = '클립 가져오기';
  } else if (status.value === 'duplicate') {
    icon = 'xi-check-circle-o';
    title = '이미 가져온 클립이에요.';
    color = 'green';
    button = true;
    buttonText = '클립 보러가기';
  } else if (status.value === 'editSuccess') {
    icon = 'xi-check-circle-o';
    title = '이름 변경 완료!';
    color = 'green';
    button = true;
    buttonText = '클립 보러가기';
  } else if (status.value === 'editFailed') {
    icon = 'xi-error-o';
    title = '이름을 바꾸는 중 오류가 발생했어요.';
    color = 'red';
    button = true;
    buttonText = '다시 시도하기';
  } else if (status.value === 'editFailedCritical') {
    icon = 'xi-error-o';
    title = '지금은 이름을 바꿀 수 없어요. 나중에 다시 시도해주세요.';
    color = 'red';
    button = true;
    buttonText = '클립 보러가기';
  } else if (status.value === 'createFailed') {
    icon = 'xi-error-o';
    title = '클립을 가져오는 중 오류가 발생했어요.';
    color = 'red';
    button = true;
    buttonText = '다시 가져오기';
  } else if (status.value === 'createFailedCritical') {
    icon = 'xi-error-o';
    title = '지금은 클립을 가져올 수 없어요. 나중에 다시 시도해주세요.';
    color = 'red';
    button = false;
  } else if (status.value === 'login') {
    icon = 'xi-error-o';
    title = '다시 로그인이 필요해요.';
    color = 'red';
    button = false;
  }

  return {
    icon,
    title,
    description,
    color,
    button,
    buttonText,
  };
});

const updateInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const updatedText = target.value;
  input.value = updatedText;
};

const buttonAction = async () => {
  if (
    status.value === 'ready' ||
    status.value === 'notClip' ||
    status.value === 'notExist' ||
    status.value === 'notAllowedChannel'
  ) {
    status.value = 'create';
    const validate = await (
      await axios
        .get(`${VITE_API_URL}/yt?url=${input.value}`)
        .catch(async () => {
          await auth.refreshAuthority();
          return await axios.get(`${VITE_API_URL}/yt?url=${input.value}`);
        })
    ).data;

    if (!validate) {
      status.value = 'createFailed';
      return;
    }

    validate.status === 1
      ? status.value = 'notClip'
      : validate.status === 2
        ? status.value = 'notExist'
        : validate.status === 3
          ? status.value = 'notAllowedChannel'
          : validate.status === 4
            ? status.value = 'duplicate'
            : status.value = 'createSuccess';

    if (
      status.value === 'createSuccess' ||
      status.value === 'duplicate'
    ) {
      clip.value = validate;
      input.value = '';
    }
  } else if (status.value === 'createSuccess') {
    if (input.value) {
      const updateClipName = await (
        await axios.post(`${VITE_API_URL}/editClip`, {
          id: clip.value?.id,
          name: input.value,
        })
      ).data;

      if (!updateClipName) {
        status.value = 'editFailed';
        return;
      }

      status.value = 'editSuccess';
    } else {
      window.open(`${VITE_HOST_URL}/detail/${clip.value?.id}`);
    }
  } else if (status.value === 'editSuccess') {
    window.open(`${VITE_HOST_URL}/detail/${clip.value?.id}`);
  } else if (status.value === 'duplicate') {
    window.open(`${VITE_HOST_URL}/detail/${clip.value?.id}`);
  } else if (status.value === 'editFailed') {
    const updateClipName = await (
      await axios.post(`${VITE_API_URL}/editClip`, {
        id: clip.value?.id,
        name: input.value,
      })
    ).data;

    if (!updateClipName) {
      status.value = 'editFailedCritical';
      return;
    }

    status.value = 'editSuccess';
  } else if (status.value === 'editFailedCritical') {
    window.open(`${VITE_HOST_URL}/detail/${clip.value?.id}`);
  } else if (status.value === 'createFailed') {
    const validate = await (
      await axios
        .get(`${VITE_API_URL}/yt?url=${input.value}`)
        .catch(async () => {
          await auth.refreshAuthority();
          return await axios.get(`${VITE_API_URL}/yt?url=${input.value}`);
        })
    ).data;

    if (!validate) {
      status.value = 'createFailedCritical';
      return;
    }

    validate.status === 1
      ? status.value = 'notClip'
      : validate.status === 2
        ? status.value = 'notExist'
        : validate.status === 3
          ? status.value = 'notAllowedChannel'
          : validate.status === 4
            ? status.value = 'duplicate'
            : status.value = 'createSuccess';

    if (status.value === 'createSuccess') clip.value = validate;
  }
};
</script>
<template>
  <div>
    <ExtensionHeader />
    <ExtensionAd />
    <div class="m-auto mb-24 flex max-w-sm flex-col p-5">
      <span class="mb-3 font-semibold hover:underline underline-offset-4 hover:text-blue-500">
        <a
          href="/extension"
          target="_self"
        >← 돌아가기</a>
      </span>
      <div
        class="flex flex-col rounded-3xl p-5 mb-5"
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
        <div class="text-xl">
          {{ blockStatus.title }}
        </div>
        <div
          v-if="
            status === 'ready' ||
              status === 'createSuccess' ||
              status === 'notClip' ||
              status === 'notExist' ||
              status === 'notAllowedChannel'
          "
        >
          <div class="mt-3 mb-2">
            {{ blockStatus.description }}
          </div>
          <input
            :placeholder="
              (
                status === 'ready' ||
                status === 'notClip' ||
                status === 'notExist' ||
                status === 'notAllowedChannel'
              ) ? 'https://www.youtube.com/clip/xxxxx' : clip.title"
            :value="input"
            type="text"
            class="w-full rounded-2xl border-white p-4"
            @input="updateInput"
          >
        </div>
        <div
          v-if="status === 'createSuccess' && !input"
          class="mt-3 -mb-1 text-sm text-center"
        >
          또는
        </div>
        <button
          v-if="blockStatus.button"
          target="_blank"
          class="mt-4 cursor-pointer rounded-3xl p-4 text-base no-underline transition-all duration-300 hover:shadow-lg"
          :class="{
            'bg-slate-100 hover:shadow-slate-300': blockStatus.color === 'slate',
            'bg-blue-100 hover:shadow-blue-300': blockStatus.color === 'blue',
            'bg-green-100 hover:shadow-green-300': blockStatus.color === 'green',
            'bg-red-100 hover:shadow-red-300': blockStatus.color === 'red',
          }"
          @click="buttonAction"
        >
          {{ blockStatus.buttonText }}
        </button>
      </div>
      <a
        v-if="!loginStatus"
        :href="`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=0373yf8vzqpo4f9ln4ajqrq9fim3hd&redirect_uri=${VITE_HOST_URL}/authorization?type=extension&scope=clips%3Aedit%20user%3Aread%3Aemail%20user%3Aread%3Asubscriptions`"
        target="_blank"
        class="w-full text-center rounded-3xl bg-[#9146ff] p-4 text-base text-white no-underline transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/60 mb-5"
      >로그인 하고 클립 가져오기</a>
      <a
        href="https://support.google.com/youtube/answer/10332730?hl=ko"
        target="_blank"
        class="w-full text-center transition-all duration-300 text-slate-600 font-semibold underline underline-offset-4 hover:text-blue-500"
      >유튜브에도 클립이 있어요?</a>
    </div>
  </div>
</template>
