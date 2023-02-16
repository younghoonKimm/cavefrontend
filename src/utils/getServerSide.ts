import axiosInstance from '@/api/axios';

export const setAxiosDefaultHeaderCookie = (cookie: string) => {
  axiosInstance.defaults.headers.cookie = cookie;
};

export const setAxiosDefaultForServerSide = (cookie: string) => {
  setAxiosDefaultHeaderCookie(cookie);
  axiosInstance.defaults.baseURL = 'http://backend:3001/api';
};
