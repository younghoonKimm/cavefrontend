import useAuth from '@/hooks/useAuth';
import { resetTokens } from '@/utils/getCookies';
import axios from 'axios';
import { setCookie } from 'cookies-next';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

const resetAuth = () => {
  resetTokens();
  window.location.href = '/';
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;

    if (status === 401) {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/getToken`,
        );

        const { accessToken, refreshToken } = res.data;
        setCookie('CAV_ACC', accessToken);
        setCookie('CAV_RFS', refreshToken);

        const originRes = await axios.request(originalRequest);
        return originRes;
      } catch (error) {
        resetAuth();
      }
    }

    if (status === 403) {
      resetAuth();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
