import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref } from 'vue';
import axios from 'axios';
import { useAuth } from '../plugins/useAuth';

const VITE_API_URL: string = import.meta.env.VITE_API_URL;
const auth = useAuth();

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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    streamInfo: ref<StreamInfo | undefined | null>(),
    me: useStorage('me', {}),
  }),
  actions: {
    async whoami() {
      if (Object.keys(this.me).length !== 0) return this.me;
      try {
        return (this.me = await (await axios.get(`${VITE_API_URL}/whoami`)).data);
      } catch {
        try {
          if (!await auth.refreshAuthority()) {
            return null;
          }
          return (this.me = await (await axios.get(`${VITE_API_URL}/whoami`)).data);
        } catch {
          return null;
        }
      }
    },

    async getStreamInfo() {
      if (this.streamInfo != null) return this.streamInfo;

      try {
        const response = await axios.get(`${VITE_API_URL}/getStreamInfo`);
        return (this.streamInfo = response.data?.data[0]);
      } catch {
        return (this.streamInfo = null);
      }
    },
  },
});
