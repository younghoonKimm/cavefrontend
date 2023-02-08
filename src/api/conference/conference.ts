import axiosInstance from '../axios';

export const postConferenceAPI = async (conferenceData: any) => {
  try {
    await axiosInstance.post('/conference/create', conferenceData);
  } catch (error) {
    return Promise.reject(error);
  }
};
