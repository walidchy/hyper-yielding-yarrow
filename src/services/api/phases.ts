
import api from '@/utils/api';
import { Phase } from '@/types';

export const getPhases = async (): Promise<Phase[]> => {
  try {
    const response = await api.get('/phases');
    // Map the response data to include the missing required fields
    const phases = (response.data?.data || response.data || []).map((phase: any) => ({
      id: phase.id,
      name: phase.name, 
      year: phase.year || new Date().getFullYear(),
      description: phase.description || '',
      start_date: phase.start_date,
      end_date: phase.end_date,
      status: phase.status || 'planning',
      created_at: phase.created_at,
      updated_at: phase.updated_at
    }));
    return phases;
  } catch (error) {
    console.error('Error fetching phases:', error);
    return [];
  }
};

export const createPhase = async (data: Partial<Phase>): Promise<Phase> => {
  try {
    const response = await api.post('/phases', data);
    return response.data;
  } catch (error) {
    console.error('Error creating phase:', error);
    throw error;
  }
};

export const updatePhase = async (id: number, data: Partial<Phase>): Promise<Phase> => {
  try {
    const response = await api.put(`/phases/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating phase:', error);
    throw error;
  }
};

export const deletePhase = async (id: number): Promise<void> => {
  try {
    await api.delete(`/phases/${id}`);
  } catch (error) {
    console.error('Error deleting phase:', error);
    throw error;
  }
};
