import { resetTokens } from '@/utils/getCookies';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { getNewTokenAPI } from './auth/auth';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

const resetAuth = () => {
  resetTokens();
  // if (window) {
  //   window.location.href = '/';
  // }
};

export const refreshToken = async (error: any) => {
  const { config, response } = error;
  const originalRequest = config;
  const { status } = response;
  if (status === 401) {
    try {
      const newToken = await getNewTokenAPI();

      const { accessToken, refreshToken } = newToken.data;

      setCookie('CAV_ACC', accessToken);
      setCookie('CAV_RFS', refreshToken);

      const originRes = await axiosInstance.request(originalRequest);
      return originRes;
    } catch (error) {
      resetAuth();
    }
  }

  if (status === 403) {
    return resetAuth();
  }

  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return refreshToken(error);
  },
);

export default axiosInstance;
