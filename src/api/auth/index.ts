import { IUser } from '@/types/auth';
import { getAccessToken, getRefreshToken } from '@/utils/getCookies';

import axiosInstance from '../axios';

export const getProfileAPI = async () => await axiosInstance.get('/auth/me');

export async function getMe(): Promise<IUser> {
  const { data } = await getProfileAPI();
  return data.user;
}

export const logOutAPI = async () => await axiosInstance.get(`/auth/logout`);
