import { IUser } from '@/types/auth';

import axiosInstance from '../axios';

export const getProfileAPI = async () => await axiosInstance.get('/auth/me');

export const logOutAPI = async () => await axiosInstance.get(`/auth/logout`);

export const getNewTokenAPI = async () =>
  await axiosInstance.get(`/auth/getToken`);
