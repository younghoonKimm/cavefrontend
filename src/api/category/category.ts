import { ICategoryInput } from '@/types/category';
import axiosInstance from '../axios';

export const getCategoryAPI = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/category/${id}`);

    return res;
  } catch (e) {
    throw e;
  }
};

export const postCategoryAPI = async (categoryData: ICategoryInput) => {
  try {
    const res = await axiosInstance.post('/category/create', categoryData);

    return res;
  } catch (e) {
    throw e;
  }
};
