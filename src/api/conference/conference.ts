import { IConference } from '@/types/conference';
import axiosInstance from '../axios';

export const postConferenceAPI = async (conferenceData: any) => {
  try {
    const res = await axiosInstance.post('/conference/create', conferenceData);
    return res;
  } catch (e) {
    throw new Error();
  }
};

export const getConferencesAPI = async () => {
  try {
    const res = await axiosInstance.get('/conference');
    return res;
  } catch (e) {
    throw new Error();
  }
};

export const deleteConferenceAPI = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/conference/${id}`);
    return res;
  } catch (e) {
    throw new Error();
  }
};

export const getConferenceAPI = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/conference/${id}`);

    return res;
  } catch (e) {
    return Promise.reject(e);
  }
};

export const patchConferenceAPI = async (id: string, data: IConference) => {
  try {
    const res = await axiosInstance.patch(`/conference/${id}`, { data });
    return res;
  } catch (e) {
    throw new Error();
  }
};
