import axios from 'axios';

interface Auth {
  checkAuthority: () => Promise<boolean>;
  refreshAuthority: () => Promise<boolean>;
}

export const useAuth = (): Auth => {
  const VITE_API_URL: string = import.meta.env.VITE_API_URL;

  const auth = {
    checkAuthority: async () => {
      try {
        await axios.get(`${VITE_API_URL}/auth/access`);
        return true;
      } catch {
        return false;
      }
    },
    refreshAuthority: async () => {
      try {
        await axios.get(`${VITE_API_URL}/auth/refresh`);
        return true;
      } catch {
        return false;
      }
    },
  };

  return auth;
};
