import { resetTokens } from '@/utils/getCookies';
import axios from 'axios';
import { removeCookies } from 'cookies-next';

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

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
      return;
      //   const retryOriginalRequest = new Promise((resolve) => {
      //     addRefreshSubscriber((accessToken) => {
      //       originalRequest.headers.Authorization = 'Bearer ' + accessToken;
      //       resolve(axios(originalRequest));
      //     });
      //   });
      //   return retryOriginalRequest;
    }

    if (status === 403) {
      // resetTokens();
      // window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
