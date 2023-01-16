import axios from "axios";

export const useAuth = () => {
  const auth = {
    checkAuthority: async () => {
      const accessToken = localStorage.getItem('access_token');
      if(!accessToken) {
        return false
      }

      try {
        const response = await axios.get('https://api.naseong.kim/access', {
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

        const response = await axios.get('https://api.naseong.kim/refresh', {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          }
        });

        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)

        return true
      } catch {
        return false
      }
    }
  }

  return auth;
}
