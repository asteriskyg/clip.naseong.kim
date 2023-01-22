import axios from "axios";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";

export const useAuth = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const auth = {
    checkAuthority: async () => {
      interface access {
        aud: string;
        exp: number;
        iat: number;
      }
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        return auth.refreshAuthority();
      }

      const accessExp = jwt_decode<access>(accessToken).exp;

      if (
        !dayjs().isBefore(dayjs.unix(accessExp)) ||
        dayjs.unix(accessExp).diff(dayjs(), "m") < 10
      ) {
        return auth.refreshAuthority();
      }

      const twitchAuthority = await auth.checkTwitchAuthority();

      if (!twitchAuthority) {
        return false;
      }

      return true;
    },

    refreshAuthority: async () => {
      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          return false;
        }

        const response = await axios.get(`${VITE_API_URL}/refresh`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);

        const twitchAuthority = await auth.checkTwitchAuthority();

        if (!twitchAuthority) {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    },

    checkTwitchAuthority: async () => {
      try {
        await axios.get(`${VITE_API_URL}/validateTwitch`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        return true;
      } catch {
        return false;
      }
    },
  };

  return auth;
};
