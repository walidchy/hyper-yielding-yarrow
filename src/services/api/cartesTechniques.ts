
import api from '@/utils/api';
import { CarteTechnique } from '@/types';

export const getCartesTechniques = async (): Promise<CarteTechnique[]> => {
  try {
    const response = await api.get('/cartes-techniques');
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    console.log('Unexpected response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching cartes techniques:', error);
    return [];
  }
};

export const createCarteTechnique = async (data: Partial<CarteTechnique>) => {
  try {
    const response = await api.post('/cartes-techniques', data);
    return response.data;
  } catch (error) {
    console.error('Error creating carte technique:', error);
    throw error;
  }
};

export const updateCarteTechnique = async (id: number, data: Partial<CarteTechnique>) => {
  try {
    const response = await api.put(`/cartes-techniques/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating carte technique:', error);
    throw error;
  }
};

export const deleteCarteTechnique = async (id: number) => {
  try {
    const response = await api.delete(`/cartes-techniques/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting carte technique:', error);
    throw error;
  }
};
