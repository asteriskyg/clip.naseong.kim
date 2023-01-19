import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuth } from "../plugins/useAuth";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

interface me {
  displayName: string;
  email: string;
  profileImageUrl: string;
  profileBackgroundUrl: string;
  twitchUserId: number;
  userType: string;
  follow: Date | undefined;
  subscription: number | undefined;
}

interface streamInfo {
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
    loginStatus: ref<boolean>(),
    me: ref<me>(),
    streamInfo: ref<streamInfo>(),
  }),
  actions: {
    async checkAuthority() {
      const auth = useAuth();
      const status = await auth.checkAuthority();
      this.loginStatus = status;

      return this.loginStatus;
    },

    async whoami() {
      const accessToken = localStorage.getItem("access_token");
      const userData = await axios.get(`${VITE_API_URL}/whoami`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return (this.me = userData.data);
    },

    async getStreamInfo() {
      const accessToken = localStorage.getItem("access_token");
      const getStreamInfo = await axios.get(`${VITE_API_URL}/getStreamInfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      getStreamInfo.data?.data[0]
        ? (this.streamInfo = getStreamInfo.data?.data[0])
        : (this.streamInfo = undefined);
      return this.streamInfo;
    },
  },
});
