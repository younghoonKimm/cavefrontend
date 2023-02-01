import { IUser } from '@/types/auth';
import { getAccessToken, getRefreshToken } from '@/utils/getCookies';

import axiosInstance from '../axios';

export async function getMe(): Promise<IUser> {
  const at = getAccessToken();
  const rt = getRefreshToken();

  if (!at || !rt) return null;

  const { data } = await axiosInstance.get('/auth/me');

  return data.user;
}

export const logOut = async () => {
  let res = await axiosInstance.get(`/auth/logout`);
};
