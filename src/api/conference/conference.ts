import axiosInstance from '../axios';

export const postConferenceAPI = async (conferenceData: any) =>
  await axiosInstance.post('/conference/create', conferenceData);

export const getConferenceAPI = async () =>
  await axiosInstance.get('/conference');
