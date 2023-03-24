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
  exp: number;
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
      let object;
      object = localStorage.getItem('me');

      if (object === null) {
        try {
          if (!await auth.refreshAuthority()) return null;

          const response = await (await axios.get(`${VITE_API_URL}/whoami`)).data;
          response.exp = Date.now() + 1000 * 60 * 30;
          return (this.me = response as Me);
        } catch {
          return null;
        }
      } else {
        object = JSON.parse(object) as Me;
      }

      if (Date.now() < object.exp) return this.me;
      try {
        const response = await (await axios.get(`${VITE_API_URL}/whoami`)).data;
        response.exp = Date.now() + 1000 * 60 * 30;
        return (this.me = response);
      } catch {
        try {
          if (!await auth.refreshAuthority()) return null;

          const response = await (await axios.get(`${VITE_API_URL}/whoami`)).data;
          response.exp = Date.now() + 1000 * 60 * 30;
          return (this.me = response);
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
