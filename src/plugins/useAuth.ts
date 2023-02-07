import axios from 'axios';

interface Auth {
  refreshAuthority: () => Promise<boolean>;
}

export const useAuth = (): Auth => {
  const VITE_API_URL: string = import.meta.env.VITE_API_URL;

  const auth = {
    refreshAuthority: async () => {
      try {
        await axios.get(`${VITE_API_URL}/refresh`);
        await axios.get(`${VITE_API_URL}/validateTwitch`);

        return true;
      } catch {
        return false;
      }
    },
  };

  return auth;
};
