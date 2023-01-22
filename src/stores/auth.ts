import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuth } from "../plugins/useAuth";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

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

export const useAuthStore = defineStore("auth", {
  state: () => ({
    loginStatus: ref<boolean>(true),
    me: ref<Me>(),
    streamInfo: ref<StreamInfo>(),
  }),
  actions: {
    async checkAuthority() {
      const auth = useAuth();
      const status = await auth.checkAuthority();
      return (this.loginStatus = status);
    },

    async whoami() {
      try {
        const accessToken = localStorage.getItem("access_token");
        const userData = await axios.get(`${VITE_API_URL}/whoami`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return (this.me = userData.data as Me);
      } catch (e) {
        this.me = undefined;
      }
    },

    async getStreamInfo() {
      try {
        const accessToken = localStorage.getItem("access_token");
        const getStreamInfo = await axios.get(`${VITE_API_URL}/getStreamInfo`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return (this.streamInfo = getStreamInfo.data?.data[0]);
      } catch (e) {
        return undefined;
      }
    },
  },
});
