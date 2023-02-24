import axiosInstance from '../axios';

export const patchAgendaAPI = async (id: string, data: any) => {
  try {
    const res = await axiosInstance.patch(`/agenda/${id}`, { data });
    return res;
  } catch (e) {
    throw new Error();
  }
};
