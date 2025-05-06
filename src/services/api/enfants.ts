import api from '@/utils/api';
import { Enfant } from '@/types';

export const getEnfants = async (): Promise<Enfant[]> => {
  try {
    const response = await api.get('/enfants');
    
    // Handle different response formats
    if (!response.data) return [];
    
    // Check for Laravel pagination format with success flag
    if (response.data.success && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
      return response.data.data.data;
    }
    
    // Check if the response has a nested data property with pagination
    if (response.data.data && Array.isArray(response.data.data.data)) {
      return response.data.data.data;
    }
    
    // Check if the response has a nested data property
    if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Check if the response is directly an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    console.log('Unexpected response format:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching enfants:', error);
    return [];
  }
};

export const getEducateurEnfants = async (educateurId: number): Promise<Enfant[]> => {
  try {
    // The API filters based on the authenticated user's role
    const response = await api.get('/enfants');
    
    // Handle different response formats
    if (!response.data) return [];
    
    // Check for Laravel pagination format with success flag
    if (response.data.success && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
      console.log('Educator: Using nested data.data.data format');
      return response.data.data.data;
    }
    
    // Check if the response has a nested data property with success flag
    if (response.data.success && Array.isArray(response.data.data)) {
      console.log('Educator: Using success.data format');
      return response.data.data;
    }
    
    // Check if the response has a nested data property
    if (response.data.data && Array.isArray(response.data.data)) {
      console.log('Educator: Using data array format');
      return response.data.data;
    }
    
    // Check if the response is directly an array
    if (Array.isArray(response.data)) {
      console.log('Educator: Using direct array format');
      return response.data;
    }
    
    // Handle Laravel pagination format without success flag
    if (response.data.data && Array.isArray(response.data.data.data)) {
      console.log('Educator: Using data.data pagination format');
      return response.data.data.data;
    }
    
    console.log('Unexpected response format for educator enfants:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching educator\'s children:', error);
    return [];
  }
};

export const createEnfant = async (enfantData: Partial<Enfant>) => {
  try {
    const response = await api.post('/enfants', enfantData);
    return response.data;
  } catch (error) {
    console.error('Error creating enfant:', error);
    throw error;
  }
};

export const updateEnfant = async (id: number, enfantData: Partial<Enfant>) => {
  try {
    const response = await api.put(`/enfants/${id}`, enfantData);
    return response.data;
  } catch (error) {
    console.error('Error updating enfant:', error);
    throw error;
  }
};

export const deleteEnfant = async (id: number) => {
  try {
    const response = await api.delete(`/enfants/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting enfant:', error);
    throw error;
  }
};
