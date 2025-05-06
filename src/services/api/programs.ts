
import api from '@/utils/api';
import { Program } from '@/types';

export const getPrograms = async (): Promise<Program[]> => {
  try {
    const response = await api.get('/programme');
    // Ensure we always return an array
    if (!response.data) return [];
    return Array.isArray(response.data) ? response.data : 
           (response.data.data && Array.isArray(response.data.data)) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching programs:', error);
    return []; // Return empty array on error
  }
};

export const createProgram = async (programData: Partial<Program>) => {
  try {
    const response = await api.post('/programme', programData);
    return response.data;
  } catch (error) {
    console.error('Error creating program:', error);
    throw error;
  }
};

export const updateProgram = async (id: number, programData: Partial<Program>) => {
  try {
    const response = await api.put(`/programme/${id}`, programData);
    return response.data;
  } catch (error) {
    console.error('Error updating program:', error);
    throw error;
  }
};

export const deleteProgram = async (id: number) => {
  try {
    const response = await api.delete(`/programme/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting program:', error);
    throw error;
  }
};

export const getPhases = async () => {
  try {
    const response = await api.get('/phases');
    return Array.isArray(response.data) ? response.data : 
           (response.data.data && Array.isArray(response.data.data)) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching phases:', error);
    return [];
  }
};
