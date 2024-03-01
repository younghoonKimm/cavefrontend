// import { IUser } from '@/types/auth';

import axiosInstance from '../axios';

export const getProfileAPI = async () => {
  try {
    const res = await axiosInstance.get('/auth/me');
    return res;
  } catch (e) {
    throw e;
  }
};

export const logOutAPI = async () => {
  try {
    // const res = await axiosInstance.post(`/auth/logout`);

    return res;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getNewTokenAPI = async () => {
  try {
    const res = await axiosInstance.get(`/auth/getToken`);
    return res;
  } catch (e) {
    throw e;
  }
};
