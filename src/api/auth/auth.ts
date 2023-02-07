import { IUser } from '@/types/auth';
import { AxiosError } from 'axios';

import axiosInstance from '../axios';

export const getProfileAPI = async () => await axiosInstance.get('/auth/me');

export async function getMe(): Promise<IUser | AxiosError> {
  const res = await getProfileAPI();

  const { data } = res;

  return data.user;
}

export const logOutAPI = async () => await axiosInstance.get(`/auth/logout`);

export const getNewTokenAPI = async () =>
  await axiosInstance.get(`/auth/getToken`);
