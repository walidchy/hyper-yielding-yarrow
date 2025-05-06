import api from '@/utils/api';
import { Hobby } from '@/types';

export const getHobbies = async (): Promise<Hobby[]> => {
  try {
    const response = await api.get('/enfants');
    
    // Handle different response formats
    if (!response.data) return [];
    
    let enfantsData = [];
    
    // Check for Laravel pagination format with success flag
    if (response.data.success && response.data.data) {
      if (response.data.data.data && Array.isArray(response.data.data.data)) {
        enfantsData = response.data.data.data;
      } else if (Array.isArray(response.data.data)) {
        enfantsData = response.data.data;
      }
    } else if (Array.isArray(response.data)) {
      enfantsData = response.data;
    }
    
    // Transform enfants data to hobby format
    return enfantsData.map((enfant: any) => ({
      id: enfant.id,
      enfant_id: enfant.id,
      enfant_name: enfant.name,
      hobbies: enfant.hobbies ? enfant.hobbies.split(',').map((item: string) => item.trim()) : [],
      interests: enfant.interests ? enfant.interests.split(',').map((item: string) => item.trim()) : [],
      type: 'hobby',
      description: [],
      created_at: enfant.created_at || new Date().toISOString(),
      updated_at: enfant.updated_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching hobbies:', error);
    return [];
  }
};

export const createHobby = async (id: number, data: Partial<Hobby>): Promise<Hobby> => {
  const payload = {
    hobbies: Array.isArray(data.hobbies) ? data.hobbies.join(', ') : data.hobbies,
    interests: Array.isArray(data.interests) ? data.interests.join(', ') : data.interests
  };

  const response = await api.put(`/enfants/${id}`, payload);
  return response.data.data;
};

export const updateHobby = async (id: number, data: Partial<Hobby>): Promise<Hobby> => {
  // Validate ID before making the request
  if (!id) {
    throw new Error('Cannot update hobby: Invalid or missing ID');
  }
  
  // Transform the data to match what the API expects
  const payload = {
    name: data.enfant_name,
    hobbies: Array.isArray(data.hobbies) ? data.hobbies.join(', ') : data.hobbies,
    interests: Array.isArray(data.interests) ? data.interests.join(', ') : data.interests
  };
  
  const response = await api.put(`/enfants/${id}`, payload);
  return response.data.data;
};

export const deleteHobby = async (id: number): Promise<void> => {
  if (!id) {
    throw new Error('Cannot delete hobby: Invalid ID');
  }
  const payload = {
    hobbies: '',
    interests: ''
  };
  await api.put(`/enfants/${id}`, payload);
};
