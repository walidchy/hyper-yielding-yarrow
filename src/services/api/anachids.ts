
import api from '@/utils/api';
import { Anachid } from '@/types';

export const getAnachids = async (): Promise<Anachid[]> => {
  try {
    const response = await api.get('/anachids');
    return Array.isArray(response.data) ? response.data : 
           (response.data.data && Array.isArray(response.data.data)) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching anachids:', error);
    return [];
  }
};

export const createAnachid = async (anachidData: FormData) => {
  const response = await api.post('/anachids', anachidData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateAnachid = async (id: number, anachidData: FormData) => {
  const response = await api.post(`/anachids/${id}?_method=PATCH`, anachidData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteAnachid = async (id: number) => {
  const response = await api.delete(`/anachids/${id}`);
  return response.data;
};
