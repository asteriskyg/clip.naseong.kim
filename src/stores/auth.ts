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
  id?: number;
  user_id?: number;
  user_login?: string;
  user_name?: string;
  game_id?: number;
  game_name?: string;
  type?: string;
  title?: string;
  viewer_count?: number;
  started_at?: Date;
  language?: string;
  thumbnail_url?: string;
  tag_ids?: string[];
  tags?: string[];
  is_mature?: boolean;
  status: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    streamInfo: ref<StreamInfo>(),
    me: useStorage('me', {}) as unknown as Me,
  }),
  actions: {
    async whoami(): Promise<Me | undefined> {
      if (
        Object.keys(this.me).length !== 0 &&
        await auth.checkAuthority()
      ) return this.me;

      try {
        await auth.refreshAuthority();
        const response = await (await axios.get(`${VITE_API_URL}/user/detail`)).data;
        return (this.me = response);
      } catch {
        return undefined;
      }
    },

    async getStreamInfo(): Promise<StreamInfo | undefined> {
      if (this.streamInfo != null) return this.streamInfo;

      try {
        const response = await axios.get(`${VITE_API_URL}/stream`);

        if (response.data.status === 'online') {
          this.streamInfo = response.data;
        } else if (response.data.status === 'offline') {
          this.streamInfo = { status: 'offline' };
        } else if (response.data.status === 'unknown') {
          this.streamInfo = { status: 'unknown' };
        }
      } catch {
        this.streamInfo = { status: 'unknown' };
      }

      return this.streamInfo;
    },
  },
});
