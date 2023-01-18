import axios from "axios";

export const useAuth = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  const auth = {
    checkAuthority: async () => {
      const accessToken = localStorage.getItem('access_token');
      if(!accessToken) {
        return false
      }

      try {
        const response = await axios.get(`${VITE_API_URL}/access`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });

        return true
      } catch {
        return auth.refreshAuthority();
      }
    },

    refreshAuthority: async () => {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if(!refreshToken) {
          return false
        }

        const response = await axios.get(`${VITE_API_URL}/refresh`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          }
        });

        localStorage.setItem('access_token', response.data.access_token)

        return true
      } catch {
        return false
      }
    }
  }

  return auth;
}
