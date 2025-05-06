
import api from '@/utils/api';
import { Maladie } from '@/types';

export const getMaladies = async (): Promise<Maladie[]> => {
  try {
    const response = await api.get('/maladies');
    
    // Handle different response formats
    if (!response.data) return [];
    
    // Check if the response is directly an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Check if the response has a nested data property
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching maladies:', error);
    return [];
  }
};

export const createMaladie = async (maladieData: Omit<Maladie, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const response = await api.post('/maladies', maladieData);
    return response.data;
  } catch (error) {
    console.error('Error creating maladie:', error);
    throw error;
  }
};

export const updateMaladie = async (id: number, maladieData: Partial<Maladie>) => {
  try {
    const response = await api.put(`/maladies/${id}`, maladieData);
    return response.data;
  } catch (error) {
    console.error('Error updating maladie:', error);
    throw error;
  }
};

export const deleteMaladie = async (id: number) => {
  try {
    const response = await api.delete(`/maladies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting maladie:', error);
    throw error;
  }
};

export const getMaladiesByEnfant = async (enfantId: number): Promise<Maladie[]> => {
  try {
    const response = await api.get(`/maladies/by-enfant/${enfantId}`);
    
    if (!response.data) return [];
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching maladies for enfant ${enfantId}:`, error);
    return [];
  }
};
