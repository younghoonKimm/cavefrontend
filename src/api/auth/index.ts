import { IUser } from '@/types/auth';
import { getAccessToken } from '@/utils/getCookies';
import { AxiosError, AxiosResponse } from 'axios';
import { CookieValueTypes, getCookie } from 'cookies-next';
import axiosInstance from '../axios';

export async function getMe() {
  const at = getAccessToken();
  if (!at) return null;

  const { data } = await axiosInstance.get('/auth/me');

  return data.user;
}

export const logOut = async () => {
  let res = await axiosInstance.get(`/auth/logout`);
};
