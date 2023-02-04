import { IUser } from '@/types/auth';

import axiosInstance from '../axios';

export const getProfileAPI = async () => await axiosInstance.get('/auth/me');

export async function getMe(): Promise<IUser> {
  const { data } = await getProfileAPI();

  console.log(data);
  return data.user;
}

export const logOutAPI = async () => await axiosInstance.get(`/auth/logout`);
