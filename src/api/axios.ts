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
};

export const getRefreshToken = async (error: any) => {
  const { config, response } = error;
  const originalRequest = config;
  const { status } = response;

  if (status === 403) {
    resetAuth();

    return;
  }

  if (status === 401) {
    try {
      const newToken = await getNewTokenAPI();

      const { accessToken, refreshToken } = newToken.data;

      setCookie('CAV_ACC', accessToken);
      setCookie('CAV_RFS', refreshToken);

      const originRes = await axiosInstance.request(originalRequest);
      console.log(originalRequest);
      return originRes;
    } catch (error) {
      console.log(error);
      console.log('error reset token');
      // resetAuth();
    }
  }

  throw error;
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 403) {
      resetAuth();
      // window.location.pathname = '/setting';
      throw new Error(error);
    }
    if (error.response?.status === 401) {
      try {
        return await getRefreshToken(error);
      } catch (error) {
        throw error;
      }
    }

    throw error;
  },
);

export default axiosInstance;
